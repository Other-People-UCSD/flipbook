import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import styles from './pdftoolbarfooter.module.css';
import { IconButton } from '@mui/material';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import FullscreenIcon from '@mui/icons-material/Fullscreen';

const zoomMult = 0.1;

export default function PdfToolbarFooter({ numPages, pageNumber, setPageNumber, pageScale, setPageScale, isFullscreen }) {
  function reqFullscreen() {
    if (!isFullscreen) {
      document.body.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  function handleSlider(val) {
    setPageNumber(val)
  }

  function zoomIn() {
    setPageScale(pageScale+zoomMult);
  }

  function zoomOut() {
    setPageScale(pageScale-zoomMult);
  }

  return (
    <div className={`${styles.toolbarFooterContainer}`}>
      <span>
        {pageNumber}&nbsp;/&nbsp;{numPages}
      </span>

      <Slider
        min={0}
        max={numPages}
        step={2}
        defaultValue={2}
        onChange={handleSlider}
        className={styles.slider}
      />

      <IconButton onClick={zoomOut} >
        <ZoomOutIcon />
      </IconButton>

      <IconButton onClick={zoomIn} >
        <ZoomInIcon />
      </IconButton>

      <IconButton onClick={reqFullscreen}>
        <FullscreenIcon />
      </IconButton>
    </div>
  )
}