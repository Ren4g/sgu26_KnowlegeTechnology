"""
Code Similarity Checker
=======================
Kiểm tra xem các file nguồn Python trong repo này có trùng với code trên GitHub
hay không bằng cách dùng GitHub Code Search API.

Cách dùng:
    python scripts/check_similarity.py [--token GITHUB_TOKEN] [--threshold 0.6]

Tham số tuỳ chọn:
    --token      GitHub Personal Access Token (hoặc đặt biến môi trường GITHUB_TOKEN)
    --threshold  Ngưỡng tỉ lệ dòng trùng để báo cảo (mặc định 0.6 = 60 %)
    --verbose    Hiện chi tiết từng kết quả tìm kiếm

Quy trình:
    1. Quét tất cả file .py trong thư mục api/ và src/
    2. Trích xuất signature của mỗi hàm/class
    3. Tìm kiếm trên GitHub Code Search theo từng signature
    4. Tính tỉ lệ trùng lặp (matching lines / total lines) với difflib
    5. In báo cáo và trả về exit-code 1 nếu có file vượt ngưỡng
"""

import argparse
import difflib
import os
import re
import sys
import time
from pathlib import Path
from typing import Dict, List, Tuple

try:
    import requests
except ImportError:
    sys.exit("Cài đặt requests trước: pip install requests")


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

ROOT = Path(__file__).resolve().parent.parent
SOURCE_DIRS = [ROOT / "api", ROOT / "src"]
SEARCH_DELAY = 2.0  # giây giữa các request để tránh rate-limit

GITHUB_SEARCH_URL = "https://api.github.com/search/code"


def _collect_python_files() -> List[Path]:
    """Trả về danh sách các file .py cần kiểm tra."""
    files: List[Path] = []
    for directory in SOURCE_DIRS:
        if directory.is_dir():
            for path in sorted(directory.rglob("*.py")):
                if path.name != "__init__.py":
                    files.append(path)
    return files


def _extract_function_signatures(source: str) -> List[str]:
    """
    Trả về danh sách các dòng def/class (signature) trong file nguồn,
    dùng làm từ khoá tìm kiếm trên GitHub.
    """
    signatures: List[str] = []
    for line in source.splitlines():
        stripped = line.strip()
        # Lấy def hoặc class có tên thực sự (kể cả _private và __dunder__)
        if re.match(r"^(def|class)\s+_*[a-zA-Z][a-zA-Z0-9_]*", stripped):
            # Cắt bớt phần param để tạo query ngắn gọn
            short = re.sub(r"\(.*", "", stripped)
            signatures.append(short.strip())
    return signatures


def _search_github(query: str, token: str | None) -> List[Dict]:
    """
    Gọi GitHub Code Search API và trả về danh sách items (tối đa 5).
    """
    headers = {"Accept": "application/vnd.github+json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"

    params = {
        "q": f"{query} language:python",
        "per_page": 5,
    }

    try:
        resp = requests.get(
            GITHUB_SEARCH_URL, headers=headers, params=params, timeout=15
        )
        if resp.status_code == 403:
            print(
                "  ⚠️  GitHub API rate-limit đã hết. "
                "Cung cấp GITHUB_TOKEN để tăng giới hạn.",
                file=sys.stderr,
            )
            return []
        if resp.status_code != 200:
            return []
        return resp.json().get("items", [])
    except requests.RequestException as exc:
        print(f"  ⚠️  Lỗi kết nối: {exc}", file=sys.stderr)
        return []


def _fetch_raw_content(item: Dict, token: str | None) -> str:
    """Tải nội dung thô của file tìm thấy trên GitHub."""
    # Ưu tiên dùng raw download_url
    raw_url: str = item.get("html_url", "").replace(
        "https://github.com/", "https://raw.githubusercontent.com/"
    ).replace("/blob/", "/")
    headers = {}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    try:
        resp = requests.get(raw_url, headers=headers, timeout=15)
        if resp.status_code == 200:
            return resp.text
    except requests.RequestException:
        pass
    return ""


def _compute_similarity(local_source: str, remote_source: str) -> float:
    """
    Tính tỉ lệ tương đồng giữa hai đoạn code dùng SequenceMatcher.
    Trả về float trong [0, 1].
    """
    if not remote_source:
        return 0.0
    ratio = difflib.SequenceMatcher(
        None,
        local_source.splitlines(),
        remote_source.splitlines(),
    ).ratio()
    return ratio


# ---------------------------------------------------------------------------
# Main checker
# ---------------------------------------------------------------------------

def check_file(
    path: Path,
    token: str | None,
    threshold: float,
    verbose: bool,
) -> Tuple[bool, List[Dict]]:
    """
    Kiểm tra một file. Trả về (exceeded_threshold, findings).
    exceeded_threshold = True nếu có ít nhất 1 kết quả vượt ngưỡng.
    """
    source = path.read_text(encoding="utf-8")
    signatures = _extract_function_signatures(source)
    findings: List[Dict] = []
    exceeded = False

    if not signatures:
        return False, findings

    # Chỉ lấy tối đa 3 signature đặc trưng nhất để giảm số request
    sampled = signatures[:3]

    for sig in sampled:
        if verbose:
            print(f"  🔍 Tìm kiếm: {sig!r}")
        items = _search_github(sig, token)
        time.sleep(SEARCH_DELAY)

        for item in items:
            repo_name: str = item.get("repository", {}).get("full_name", "")
            # Bỏ qua kết quả chính là repo này
            if "Ren4g/sgu26_KnowlegeTechnology" in repo_name:
                continue

            remote_source = _fetch_raw_content(item, token)
            ratio = _compute_similarity(source, remote_source)

            finding = {
                "query": sig,
                "repo": repo_name,
                "html_url": item.get("html_url", ""),
                "similarity": ratio,
            }
            findings.append(finding)

            if ratio >= threshold:
                exceeded = True
                flag = "🚨"
            elif ratio >= 0.3:
                flag = "⚠️ "
            else:
                flag = "✅"

            if verbose or ratio >= 0.3:
                print(
                    f"    {flag} {repo_name:50s}  similarity={ratio:.0%}"
                )

    return exceeded, findings


def main() -> None:
    parser = argparse.ArgumentParser(description="Kiểm tra trùng lặp code với GitHub")
    parser.add_argument(
        "--token",
        default=os.getenv("GITHUB_TOKEN"),
        help="GitHub Personal Access Token (hoặc env GITHUB_TOKEN)",
    )
    parser.add_argument(
        "--threshold",
        type=float,
        default=0.6,
        help="Ngưỡng tỉ lệ trùng để báo cáo vi phạm (mặc định 0.6 = 60%%)",
    )
    parser.add_argument(
        "--verbose", action="store_true", help="Hiện chi tiết tất cả kết quả"
    )
    args = parser.parse_args()

    python_files = _collect_python_files()
    if not python_files:
        print("Không tìm thấy file Python nào trong api/ và src/.")
        sys.exit(0)

    print("=" * 65)
    print("  CODE SIMILARITY CHECKER – sgu26_KnowlegeTechnology")
    print("=" * 65)
    print(f"Ngưỡng báo cáo: {args.threshold:.0%}")
    print(f"Token: {'có' if args.token else 'không (rate-limit thấp hơn)'}")
    print()

    any_exceeded = False
    summary: List[Dict] = []

    for path in python_files:
        rel = path.relative_to(ROOT)
        print(f"📄 {rel}")
        exceeded, findings = check_file(
            path, args.token, args.threshold, args.verbose
        )
        if exceeded:
            any_exceeded = True
        top = sorted(findings, key=lambda f: f["similarity"], reverse=True)[:3]
        summary.append({"file": str(rel), "exceeded": exceeded, "top": top})
        print()

    # --- Báo cáo tổng kết ---
    print("=" * 65)
    print("TỔNG KẾT")
    print("=" * 65)
    for entry in summary:
        icon = "🚨" if entry["exceeded"] else "✅"
        print(f"{icon} {entry['file']}")
        for finding in entry["top"]:
            print(
                f"     {finding['similarity']:.0%}  {finding['repo']}  "
                f"{finding['html_url']}"
            )

    print()
    if any_exceeded:
        print(
            f"⚠️  Một số file có tỉ lệ tương đồng ≥ {args.threshold:.0%} "
            "với code trên GitHub.\n"
            "Hãy kiểm tra thủ công để xác nhận vi phạm thực sự."
        )
        sys.exit(1)
    else:
        print(
            f"✅ Không phát hiện file nào có tỉ lệ tương đồng ≥ "
            f"{args.threshold:.0%} với code trên GitHub."
        )
        sys.exit(0)


if __name__ == "__main__":
    main()
