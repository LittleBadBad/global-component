# 全局组件

基于react和mui5提供一些可供全局调用的组件接口，可自定义组件

## 使用

```javascript
import Master, {Global} from "global-component";
import Button from "@mui/material/Button";

function App() {
    const {openTip} = useContext(Global)
    return <Button onClick={() => {
        openTip("好椰")
    }}>
        click
    </Button>
}

ReactDOM.render(
    <React.StrictMode>
        <Master>
            <App/>
        </Master>
    </React.StrictMode>
    ,
    document.getElementById('root')
);
```
![img.png](img/img.png)

默认使用 [mui5](https://github.com/mui/material-ui) 的相关组件，可自定义

```javascript
import Master, {GlobalTip} from "global-component";
function Tip(props: GlobalTip) {
    const {
        open,
        autoHideDuration,
        type,
        info,
        onClose//用于将open set为false的函数 无需定义，使用即可
    } = props
    return <div className={'tip'}>
        {open ? <>content here</> : ""}
        <input type={"button"} onClick={() => onClose()}>关闭</input>
    </div>
}

ReactDOM.render(
    <React.StrictMode>
        <Master Tip={Tip}>
            <App/>
        </Master>
    </React.StrictMode>
    ,
    document.getElementById('root')
);
```


