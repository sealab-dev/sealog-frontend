import { NodeViewWrapper } from '@tiptap/react';
import { useState } from 'react';
import type { NodeViewProps } from '@tiptap/react';
import { FaFile } from 'react-icons/fa';
import type { FileNodeAttrs } from '../types';
import { formatFileSize } from '../utils';
import ImageModal from '../base/ImageModal';
import styles from './FileNode.module.css';
import { FILE_DOMAIN } from '@/constants/domain';

const FileNode = ({ node }: NodeViewProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const attrs = node.attrs as FileNodeAttrs;
  const { path, fileName, size, contentType } = attrs;

  // 이미지 렌더링
  if (contentType?.startsWith('image/')) {
    return (
      <NodeViewWrapper className={styles.wrapper}>
        <div className={styles.imageContainer}>
          <img
            src={FILE_DOMAIN + path}
            alt={fileName}
            className={styles.image}
            onClick={() => setIsModalOpen(true)}
            loading="lazy"
          />
        </div>

        {isModalOpen && (
          <ImageModal
            url={FILE_DOMAIN + path}
            alt={fileName}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </NodeViewWrapper>
    );
  }

  // 비디오 렌더링
  if (contentType?.startsWith('video/')) {
    return (
      <NodeViewWrapper className={styles.wrapper}>
        <div className={styles.videoContainer}>
          <video
            src={FILE_DOMAIN + path}
            controls
            controlsList="nodownload"
            className={styles.video}
          >
            <track kind="captions" />
            Your browser does not support the video tag.
          </video>
        </div>
      </NodeViewWrapper>
    );
  }

  // 그 외 파일 렌더링
  const handleDownload = () => {
    window.open(path, '_blank');
  };

  return (
    <NodeViewWrapper className={styles.wrapper}>
      <div className={styles.fileContainer} onClick={handleDownload}>
        <div className={styles.iconWrapper}>
          <FaFile className={styles.icon} />
        </div>
        <div className={styles.info}>
          <div className={styles.fileName}>{fileName}</div>
          <div className={styles.fileSize}>{formatFileSize(size)}</div>
        </div>
      </div>
    </NodeViewWrapper>
  );
};

export default FileNode;