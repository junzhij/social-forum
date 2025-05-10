<Snackbar
  open={loginPromptOpen}
  autoHideDuration={6000}
  onClose={handleClose}
  anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
  sx={{ mt: 2, ml: 2 }}
>
  <Alert severity="info" variant="filled" onClose={handleClose}>
    请登录后发帖
  </Alert>
</Snackbar> 