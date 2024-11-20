import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import PropTypes from "prop-types";

export default function FormDialog({
  handleSubmit,
  handleClickOpen,
  handleClose,
  handleInputChange,
  formData,
  open,
  isEditing,
}) {
  return (
    <>
      <AddCircleOutlineIcon onClick={handleClickOpen} />
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: (event) => {
            event.preventDefault();
            handleSubmit();
          },
        }}
      >
        <DialogTitle>{isEditing ? "Update User" : "Create User"}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="name"
            label="Name"
            placeholder="name"
            type="text"
            fullWidth
            variant="standard"
            value={formData.name}
            onChange={handleInputChange}
          />
          <TextField
            required
            margin="dense"
            id="email"
            name="email"
            label="Email"
            type="email"
            fullWidth
            variant="standard"
            value={formData.email}
            onChange={handleInputChange}
          />
          <TextField
            required={!isEditing}
            margin="dense"
            id="password"
            name="password"
            label="Password"
            type="password"
            fullWidth
            variant="standard"
            value={formData.password}
            onChange={handleInputChange}
          />
          {!isEditing && (
            <TextField
              required
              margin="dense"
              id="retypePassword"
              name="retypePassword"
              label="Retype Password"
              type="password"
              fullWidth
              variant="standard"
              value={formData.retypePassword}
              onChange={handleInputChange}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">
            {isEditing ? "Update User" : "Add User"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

FormDialog.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleClickOpen: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  formData: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  isEditing: PropTypes.bool.isRequired,
};
