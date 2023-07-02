import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import toolStyles from './pdftoolbarfooter.module.css';
import { IconButton } from '@mui/material';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import FullscreenIcon from '@mui/icons-material/Fullscreen';

const zoomMult = 0.25;

export default function PdfToolbarFooter({ numPages, pageNumber, setPageNumber, pageScale, setPageScale, isFullscreen, realignTransform }) {
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
    setPageScale(pageScale + zoomMult);
    realignTransform();
  }

  function zoomOut() {
    setPageScale(pageScale - zoomMult);
    realignTransform();
  }

  return (
    <div className={`${toolStyles.toolbarFooterContainer}`}>
      <span>
        {pageNumber}&nbsp;/&nbsp;{numPages}
      </span>

      <Slider
        min={0}
        max={numPages}
        step={2}
        defaultValue={1}
        value={pageNumber}
        onChange={handleSlider}
        className={toolStyles.slider}
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