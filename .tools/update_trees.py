import os
import re
import yaml  # 新增这一行

# 配置区
START_MARKER = "<!-- AUTO_FILE_LIST_START -->"
END_MARKER = "<!-- AUTO_FILE_LIST_END -->"
TREE_CMD = ["tree", "--noreport", "-v", "-a", "."]  # -a 显示隐藏文件，可去掉

# 改为从 types.yaml 加载（原 FILE_DESCRIPTIONS 移除）


def get_descriptions():
    try:
        with open("types.yaml", encoding="utf-8") as f:
            data = yaml.safe_load(f)
        if isinstance(data, dict):
            return data
        else:
            print("types.yaml 格式错误，应为键值对字典，已使用空映射")
            return {}
    except FileNotFoundError:
        print("未找到 types.yaml，使用空描述映射")
        return {}
    except Exception as e:
        print(f"加载 types.yaml 失败: {e}，使用空描述映射")
        return {}


FILE_DESCRIPTIONS = get_descriptions()  # 在这里加载


def human_readable_size(size_bytes):
    """把字节数转为人类可读格式：B → K → M → G"""
    if size_bytes == 0:
        return "0"
    for unit in ['B', 'K', 'M', 'G']:
        if size_bytes < 1024:
            return f"{size_bytes:.0f}{unit}" if unit == 'B' else f"{size_bytes:.1f}{unit}".rstrip('0').rstrip('.')
        size_bytes /= 1024
    return f"{size_bytes:.1f}T"  # 极少用到


def get_description(filename):
    return FILE_DESCRIPTIONS.get(filename, "")


def generate_markdown_list(dir_path):
    """生成该目录下的 Markdown 无序列表（递归子目录）"""
    lines: list[str] = []
    items = sorted(os.listdir(dir_path))  # 排序美观

    for item in items:
        item_path = os.path.join(dir_path, item)
        rel_path = os.path.relpath(item_path, dir_path)
        if rel_path == ".":
            continue

        if os.path.isdir(item_path):
            # 子目录：加粗 ~~+ 链接~~ 不加链接，会 404
            # lines.append(f"- [**{item}/**](./{item}/)")
            lines.append(f"- **{item}/**")
            # 递归添加子目录内容（缩进）
            sub_items = sorted(os.listdir(item_path))
            for sub_item in sub_items:
                sub_rel = os.path.join(item, sub_item)
                sub_path = os.path.join(item_path, sub_item)

                if os.path.isdir(sub_path):
                    lines.append(f"  - [**{sub_item}/**](./{sub_rel}/)")
                else:
                    size_str = human_readable_size(os.path.getsize(sub_path))
                    desc = get_description(sub_item)
                    line = f"  - [{sub_item}](./{sub_rel}) *({size_str})*{' - ' + f'**{desc}**' if desc else ''}"
                    lines.append(line)
        else:
            # 文件
            size_str = human_readable_size(os.path.getsize(item_path))
            desc = get_description(item)
            line = f"- [{item}](./{item}) *({size_str})*{' - ' + f'**{desc}**' if desc else ''}"
            lines.append(line)

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
        return False

    new_block = f"{START_MARKER}\n\n{new_list_content}\n\n{END_MARKER}"
    new_content = pattern.sub(new_block, content, count=1)

    if new_content == content:
        return False

    with open(readme_path, "w", encoding="utf-8") as f:
        f.write(new_content)
    print(f"Updated file list in {readme_path}")
    return True


def main(root_dir="."):
    changed = False
    for dirpath, _, filenames in os.walk(root_dir):
        if dirpath == root_dir:
            continue  # 跳过根目录本身（视需求可保留）
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
