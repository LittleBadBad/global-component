import {NavigateFunction, useNavigate} from "react-router";
import {createContext, ElementType, ReactNode, useState} from "react";
import Alert from "@mui/material/Alert";
import Backdrop from "@mui/material/Backdrop";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Snackbar from "@mui/material/Snackbar";
import {ButtonProps} from "@mui/material/Button/Button";


export interface MasterFunc {
    openTip(info: string, type?: "error" | "info" | "success" | "warning",
            autoHideDuration?: number): void,

    setLoadingOpen(open: boolean): void

    openAlert(title: string,
              content: string,
              actions: DiaAction[],
              onClose?: () => void): void

    navigate?: NavigateFunction
}

export interface DiaAction {
    handle?(): void

    name?: string
    other?: ButtonProps
}

export const Global = createContext<MasterFunc>(null);

export interface GlobalAlert {
    open: boolean,
    title?: string,
    content: string,
    actions: DiaAction[];

    /**
     * 通知关闭后响应
     */
    afterClose?(): void

    /**
     * 关闭对话框的操作
     */
    onClose?(): void
}

export interface GlobalLoading {
    loadingOpen: boolean
}

export interface GlobalTip {
    open: boolean,
    autoHideDuration: number,
    type: "error" | "info" | "success" | "warning",
    info: string,

    onClose?(): void
}

export interface DefaultProps extends Record<string, any>{
    Alert?: ElementType<GlobalAlert>
    Loading?: ElementType<GlobalLoading>
    Tip?: ElementType<GlobalTip>
    children: ReactNode
}

function DefaultAlert(props: GlobalAlert) {
    const {onClose} = props
    return <Dialog open={props.open} onClose={onClose}>
        <DialogTitle>{props.title}</DialogTitle>
        <DialogContent>
            <DialogContentText maxWidth={700} minWidth={200}>
                {props.content}
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            {props.actions?.map(value => (
                <Button onClick={() => {
                    if (typeof value.handle === 'function') {
                        value.handle()
                    }
                    onClose()
                }} key={value.name} {...value.other}>
                    {value.name}
                </Button>
            ))}
        </DialogActions>
    </Dialog>
}

function DefaultLoading(props: GlobalLoading) {
    const sxs = {
        backdrop: (theme) => ({
            zIndex: theme.zIndex.drawer + 1
        })
    }
    return <Backdrop sx={{backdrop: sxs.backdrop}} open={props.loadingOpen}>
        <CircularProgress sx={{color: '#fff'}}/>
    </Backdrop>
}

function DefaultTip(props: GlobalTip) {
    const {onClose} = props
    return <Snackbar
        anchorOrigin={{vertical: 'top', horizontal: 'center'}}
        open={props.open}
        autoHideDuration={props.autoHideDuration}
        onClose={onClose}>
        <Alert onClose={onClose} severity={props.type}>
            {props.info}
        </Alert>
    </Snackbar>
}

export default function Master(props: DefaultProps) {
    const {children, Alert, Loading, Tip, ...others} = props
    const [loadingOpen, setLoadingOpen] = useState<boolean>(false)
    const [tip, setTip] = useState<GlobalTip>({autoHideDuration: 3000, info: "", open: false, type: undefined})
    const [alertModal, setAlert] = useState<GlobalAlert>({
        open: false,
        title: 'string',
        content: 'string',
        actions: [{
            handle: () => null,
            name: '好滴',
            other: {variant: "contained", autoFocus: true}
        }],
        afterClose: () => null
    })

    const onCloseTip = () => {
        setTip({
            ...tip,
            open: false
        })
    }

    const onCloseAlert = () => {
        setAlert({
            ...alertModal,
            open: false
        })
        if (typeof alertModal.afterClose === "function") {
            alertModal.afterClose()
        }
    }

    const openTip = (info: string, type: "error" | "info" | "success" | "warning" = "success",
                     autoHideDuration: number = 3000) => {
        setTip({
            info,
            type,
            autoHideDuration,
            open: true
        })
    }
    const openAlert = (title: string,
                       content: string,
                       actions: DiaAction[] = [{
                           handle: () => null, name: '好滴', other: {variant: "contained", autoFocus: true}
                       }], onClose = () => null) => {
        setAlert({
            title,
            content,
            actions,
            afterClose: onClose,
            open: true
        })
    }

    const masterFunc: MasterFunc = {openTip, setLoadingOpen, openAlert, ...others}

    try {
        masterFunc.navigate = useNavigate()
    } catch (e) {

    }

    const AlertComp: ElementType<GlobalAlert> = Alert || DefaultAlert
    const LoadingComp: ElementType<GlobalLoading> = Loading || DefaultLoading
    const TipComp: ElementType<GlobalTip> = Tip || DefaultTip

    return <Global.Provider value={masterFunc}>
        {children}
        <AlertComp {...alertModal} onClose={onCloseAlert}/>
        <LoadingComp loadingOpen={loadingOpen}/>
        <TipComp {...tip} onClose={onCloseTip}/>
    </Global.Provider>
}
