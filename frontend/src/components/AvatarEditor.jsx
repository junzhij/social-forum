import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Slider,
  IconButton
} from '@mui/material';
import { ZoomIn, ZoomOut, Rotate90DegreesCcw } from '@mui/icons-material';
import AvatarEditor from 'react-avatar-editor';

function AvatarEditorDialog({ open, onClose, image, onSave }) {
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const editorRef = useRef(null);

  const handleSave = () => {
    if (editorRef.current) {
      const canvas = editorRef.current.getImageScaledToCanvas();
      canvas.toBlob((blob) => {
        onSave(blob);
        onClose();
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>编辑头像</DialogTitle>
      <DialogContent>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          gap: 2,
          py: 2 
        }}>
          {image && (
            <AvatarEditor
              ref={editorRef}
              image={image}
              width={250}
              height={250}
              border={50}
              borderRadius={125}
              color={[0, 0, 0, 0.6]}
              scale={scale}
              rotate={rotate}
            />
          )}
          
          <Box sx={{ 
            width: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            px: 2 
          }}>
            <IconButton onClick={() => setScale(s => Math.max(1, s - 0.1))}>
              <ZoomOut />
            </IconButton>
            <Slider
              value={scale}
              min={1}
              max={3}
              step={0.1}
              onChange={(_, value) => setScale(value)}
              sx={{ flexGrow: 1 }}
            />
            <IconButton onClick={() => setScale(s => Math.min(3, s + 0.1))}>
              <ZoomIn />
            </IconButton>
          </Box>
          
          <IconButton 
            onClick={() => setRotate(r => r + 90)}
            sx={{ mt: 1 }}
          >
            <Rotate90DegreesCcw />
          </IconButton>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>取消</Button>
        <Button 
          onClick={handleSave} 
          variant="contained"
          disabled={!editorRef.current}
        >
          保存
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AvatarEditorDialog; 