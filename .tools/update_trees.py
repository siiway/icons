import os
import subprocess
import re

# 配置区
START_MARKER = "<!-- AUTO_FILE_LIST_START -->"
END_MARKER = "<!-- AUTO_FILE_LIST_END -->"
TREE_CMD = ["tree", "--noreport", "-v", "-a", "."]  # -a 显示隐藏文件，可去掉

# 文件名 -> 描述映射（可扩展）
FILE_DESCRIPTIONS = {
    "android-chrome-512x512.png": "512x512",
    "android-chrome-192x192.png": "192x192",
    "apple-touch-icon.png": "180x180",
    "favicon-32x32.png": "32x32",
    "favicon-16x16.png": "16x16",
    "favicon.ico": "48x48",
    "site.webmanifest": "Webmanifest config file",
    "icon.svg": "Source",
    "icon-light.svg": "Light mode source",
    "icon-dark.svg": "Dark mode source",
    "old.svg": "Old version",
    # 添加更多...
}


def get_description(filename):
    return FILE_DESCRIPTIONS.get(filename, "")


def generate_markdown_list(dir_path):
    """生成该目录下的 Markdown 无序列表（递归子目录）"""
    lines = []
    items = sorted(os.listdir(dir_path))  # 排序美观

    for item in items:
        item_path = os.path.join(dir_path, item)
        rel_path = os.path.relpath(item_path, dir_path)  # 相对路径，当前目录是 .
        if rel_path == ".":
            continue

        if os.path.isdir(item_path):
            # 子目录：加粗 + 链接
            lines.append(f"- [**{item}/**](./{item}/)")
            # 递归添加子目录内容（缩进）
            sub_items = sorted(os.listdir(item_path))
            for sub_item in sub_items:
                sub_rel = os.path.join(item, sub_item)
                desc = get_description(sub_item)
                desc_part = f" - {desc}" if desc else ""
                lines.append(f"  - [{sub_item}](./{sub_rel}){desc_part}")
        else:
            # 文件
            desc = get_description(item)
            desc_part = f" - {desc}" if desc else ""
            lines.append(f"- [{item}](./{item}){desc_part}")

    return "\n".join(lines)


def update_readme(readme_path, new_list_content):
    if not os.path.exists(readme_path):
        return False

    with open(readme_path, "r", encoding="utf-8") as f:
        content = f.read()

    pattern = re.compile(
        f"{re.escape(START_MARKER)}.*?{re.escape(END_MARKER)}",
        re.DOTALL
    )

    if not pattern.search(content):
        return False  # 没有 placeholder，不处理

    new_block = f"{START_MARKER}\n\n{new_list_content}\n\n{END_MARKER}"
    new_content = pattern.sub(new_block, content, count=1)

    if new_content == content:
        return False  # 无变化

    with open(readme_path, "w", encoding="utf-8") as f:
        f.write(new_content)
    print(f"Updated file list in {readme_path}")
    return True


def main(root_dir="."):
    changed = False
    for dirpath, _, filenames in os.walk(root_dir):
        if dirpath == root_dir:
            continue  # 跳过根目录
        if "README.md" not in filenames:
            continue

        readme_path = os.path.join(dirpath, "README.md")
        new_list = generate_markdown_list(dirpath)
        if update_readme(readme_path, new_list):
            changed = True

    if not changed:
        print("No README file lists needed update.")


if __name__ == "__main__":
    main()
