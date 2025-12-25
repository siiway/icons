import os
import argparse
from PIL import Image
import sys

def replace_transparent_with_color(directory='.', target_color='white'):
    if target_color == 'white':
        fill_color = (255, 255, 255, 255)
    elif target_color == 'black':
        fill_color = (0, 0, 0, 255)
    else:
        raise ValueError("target_color 必须是 'white' 或 'black'")

    supported_ext = ('.png', '.ico')
    processed_count = 0

    for filename in os.listdir(directory):
        lowercase_name = filename.lower()
        if not (lowercase_name.endswith('.png') or lowercase_name.endswith('.ico')):
            continue

        filepath = os.path.join(directory, filename)
        if not os.path.isfile(filepath):
            continue

        try:
            with Image.open(filepath) as img:
                # 检查是否有 Alpha 或透明
                has_alpha = img.mode in ('RGBA', 'LA') or ('transparency' in img.info)

                if not has_alpha and img.mode != 'P':
                    print(f"跳过 {filename}：无透明通道")
                    continue

                # 根据原文件类型决定备份和保存的 format
                original_format = 'PNG' if lowercase_name.endswith('.png') else 'ICO'

                # 创建备份：显式指定 format，避免 .bak 扩展名问题
                backup_path = filepath + '.bak'
                if not os.path.exists(backup_path):
                    img.save(backup_path, format=original_format)
                    print(f"备份 {filename} -> {filename}.bak")

                if lowercase_name.endswith('.ico'):
                    # 处理 ICO 多帧
                    img.seek(0)
                    indices = list(range(getattr(img, 'n_frames', 1)))

                    processed_frames = []
                    original_sizes = []

                    for frame_idx in indices:
                        img.seek(frame_idx)
                        frame = img.convert('RGBA')
                        background = Image.new('RGBA', frame.size, fill_color)
                        composited = Image.alpha_composite(background, frame)
                        # ICO 通常保存为 RGB（无 Alpha）
                        processed_frames.append(composited.convert('RGB'))
                        original_sizes.append(frame.size)

                    # 保存覆盖原 ICO 文件
                    if processed_frames:
                        processed_frames[0].save(
                            filepath,
                            format='ICO',
                            append_images=processed_frames[1:],
                            sizes=original_sizes
                        )
                    print(f"处理完成 ICO {filename}（{len(processed_frames)} 张图像），透明区域替换为 {target_color}")

                else:  # PNG
                    img = img.convert('RGBA')
                    background = Image.new('RGBA', img.size, fill_color)
                    composited = Image.alpha_composite(background, img)
                    composited.save(filepath, format='PNG')
                    print(f"处理完成 PNG {filename}：透明区域替换为 {target_color}")

                processed_count += 1

        except Exception as e:
            print(f"处理 {filename} 时出错：{e}")

    if processed_count == 0:
        print("未找到任何带有透明通道的 PNG 或 ICO 文件。")
    else:
        print(f"全部完成！共处理 {processed_count} 个文件。")

if __name__ == '__main__':
    parser = argparse.ArgumentParser(
        description="将目录下 PNG 和 ICO 文件的透明区域替换为白色或黑色背景"
    )
    parser.add_argument(
        'color',
        nargs='?',
        choices=['white', 'black'],
        default='white',
        help="替换颜色：white（默认）或 black"
    )
    parser.add_argument(
        '-d', '--dir',
        default='.',
        help="要处理的目录路径，默认为当前目录"
    )

    args = parser.parse_args()

    target_dir = os.path.abspath(args.dir)
    if not os.path.isdir(target_dir):
        print(f"错误：目录不存在 -> {target_dir}")
        sys.exit(1)

    print(f"开始处理目录：{target_dir}")
    print(f"透明区域将替换为：{args.color.upper()}")
    print(f"支持格式：PNG 和 ICO\n")

    replace_transparent_with_color(target_dir, args.color)