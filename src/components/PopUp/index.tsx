import { Box, Dialog, DialogActions, DialogProps, DialogTitle, IconButton, Paper, Typography } from "@mui/material";
import { FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import { faXmark } from "@fortawesome/free-solid-svg-icons"

interface ModalCompanyProps extends DialogProps {
    title: string;
}

export default function PopUp(props: ModalCompanyProps ) {
    
    return (
        <>
            <Dialog {...props}>
                <DialogTitle>
                    <Box
                        display='flex'
                        width={'100%'}
                        justifyContent={"space-between"}
                        alignItems={"center"}
                    >
                        <Typography variant="h5">{props.title}</Typography>

                        <IconButton
                            onClick={() => {
                                props.onClose?.({}, 'escapeKeyDown')
                            }}
                        >
                            <FontAwesomeIcon icon={faXmark} />
                        </IconButton>
                    </Box>
                </DialogTitle>

                <Box
                component={Paper}
                variant="outlined"
                p={1}
                display={'flex'}
                flexDirection={"column"}
                >
                    {Array.isArray(props.children) ? props.children[0] : props.children}
                </Box>

                {Array.isArray(props.children) && !!props.children[1] ? (
                    <DialogActions>{props.children[1]}</DialogActions>
                ) : null}                
            </Dialog>
        </>
    )
}