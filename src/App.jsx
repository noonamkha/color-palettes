import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react'
import {
    ConfigProvider,
    Button,
    Layout,
    Typography,
    Card,
    Segmented,
    Col,
    Row,
    Select,
    message,
    Tag,
    theme,
    ColorPicker,
    Space,
    notification
} from 'antd'

import { BgColorsOutlined, BorderOuterOutlined } from '@ant-design/icons'
import Column from 'antd/es/table/Column';

let ModeThemeContext = createContext(null);
let CurrentStateContext = createContext(null)
let CurrentDesignContext = createContext(null)
let ColumnSideContext = createContext(null)
let BackgroundColorContext = createContext(null)
let OutlineColorContext = createContext(null)
let NotificationApiContext = createContext(null)

let cellWidth = 80
let cellHeight = 40
let flexGap = 12
let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

function useCopyToClipboard() {
    let notificationApi = useContext(NotificationApiContext)
    return async function copy(text) {
        await navigator.clipboard.writeText(text);
        notificationApi.info({
            description: <>
                <Typography.Text>Copy </Typography.Text>
                <Tag color={text} variant={'solid'}>
                    <Typography.Text style={{ color: `contrast-color(${text})`, fontFamily: "Noto Sans Mono" }}>
                        {text}
                    </Typography.Text>
                </Tag>
                <Typography.Text> to clipboard</Typography.Text>
            </>
        })
    }
}


function OverlayBox({ clipboardContent }) {
    let copy = useCopyToClipboard()
    return (
        <>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%", position: "absolute", zIndex: 1 }}>
                <Card
                    onClick={() => {
                        copy(clipboardContent['fillColor'])
                    }}
                    className='no-shadow'
                    hoverable
                    variant='borderless'
                    styles={{
                        body: {
                            padding: 0,
                        }
                    }}
                    style={{
                        height: "100%",
                        width: "50%",
                        backgroundColor: "transparent",
                        borderRadius: "8px 0 0 8px"
                    }}
                >
                </Card>
                <Card
                    onClick={() => {
                        copy(clipboardContent['bordColor'])
                    }}
                    className='no-shadow'
                    hoverable
                    variant='borderless'
                    styles={{
                        body: {
                            padding: 0
                        }
                    }}
                    style={{
                        height: "100%",
                        width: "50%",
                        backgroundColor: "transparent",
                        borderRadius: "0 8px 8px 0"
                    }}
                >
                </Card>
            </div>
        </>
    )
}

function OverlayText({ clipboardContent }) {
    let copy = useCopyToClipboard()
    return (
        <>
            <Card
                className='no-shadow'
                hoverable
                variant='borderless'
                onClick={() => {
                    copy(clipboardContent['textColor'])
                }}
                styles={{
                    body: {
                        padding: 0,
                    }
                }}
                style={{
                    position: "absolute", zIndex: 1,
                    height: "100%",
                    width: "100%",
                    backgroundColor: "transparent"
                }}
            >
            </Card>
        </>
    )
}

function Controller() {
    let [currentState, setCurrentState] = useContext(CurrentStateContext)
    let [currentDesign, setCurrentDesign] = useContext(CurrentDesignContext)
    let [backgroundColor, setBackgroundColor] = useContext(BackgroundColorContext)
    let [outlineColor, setOutlineColor] = useContext(OutlineColorContext)
    let [columnSide, setColumnSide] = useContext(ColumnSideContext)
    let textChoices1 = [
        { "value": 'auto', "label": 'text auto' },
    ]
    let textChoices2 = Array.from({ length: currentState[currentDesign]['colors'][0].length }, (_, i) => ({ "value": i, "label": `text ${i}` }));
    let textChoices = [...textChoices1, ...textChoices2]
    function changeTextChoice(val) {
        console.log("val", val)
        let cloneState = JSON.parse(JSON.stringify(currentState))
        cloneState[currentDesign]['text'] = val
        setCurrentState(cloneState)
    }
    return (
        <>
            <div style={{ display: "flex", alignItems: "center", gap: flexGap * 2, marginBottom: flexGap }}>
                <Space>
                    <Typography.Text>🎨 Design: </Typography.Text>
                    <Select
                        value={currentDesign}
                        style={{ width: 120 }}
                        onChange={(val) => { setCurrentDesign(val) }}
                        options={Object.keys(currentState).map((key) => {
                            return { "value": key, "label": key }
                        })}
                    />
                </Space>
                <Space>
                    <Typography.Text>🧭 Side: </Typography.Text>
                    <Segmented
                        value={columnSide}
                        onChange={(val) => { setColumnSide(val) }}
                        options={[{ value: "left", label: "left" }, { value: "right", label: "right" }]}
                    />
                </Space>
                <Space>
                    <Typography.Text>✒️ Text: </Typography.Text>
                    <Select
                        value={currentState[currentDesign]['text']}
                        style={{ width: 120 }}
                        onChange={(val) => { changeTextChoice(val) }}
                        options={textChoices}
                    />
                </Space>
                <Space>
                    <Typography.Text>🖼️ Background: </Typography.Text>
                    <ColorPicker showText allowClear value={backgroundColor}
                        onChange={(value) => { setBackgroundColor(value.toHexString()) }}
                        onClear={() => { setBackgroundColor("#FFFFFF") }}
                    />
                </Space>
                <Space>
                    <Typography.Text>🖼️ Outline: </Typography.Text>
                    <ColorPicker showText allowClear value={outlineColor}
                        onChange={(value) => { setOutlineColor(value.toHexString()) }}
                        onClear={() => { setOutlineColor("#ABABAB") }}
                    />
                </Space>

            </div>
        </>
    )
}

function DemoRow({ demoType, OverlayComp }) {
    let [currentState, setCurrentState] = useContext(CurrentStateContext)
    let [currentDesign, setCurrentDesign] = useContext(CurrentDesignContext)
    let [backgroundColor, setBackgroundColor] = useContext(BackgroundColorContext)
    console.log("height", cellHeight * currentState[currentDesign]['colors'][0].length)
    return (
        <>
            <div style={{
                display: "flex",
                justifyContent: "space-around",
                minWidth: cellWidth * currentState[currentDesign]['colors'].length
            }}>
                {
                    currentState[currentDesign]['colors'].map((hue, hueIdx) => {
                        let textValue = currentState[currentDesign]['text']
                        let fillColor = hue[currentState[currentDesign]["fill"]]
                        let bordColor = hue[currentState[currentDesign]["bord"]]
                        let cardStyle = {
                            minWidth: 0.9 * cellWidth, height: cellHeight
                        }
                        let textColor = null
                        let className = null
                        let cardVariant = null
                        if (demoType == 'box') {
                            cardStyle['backgroundColor'] = fillColor
                            cardStyle['borderColor'] = bordColor
                            cardVariant = "outlined"
                            className = ''
                            textColor = textValue == "auto" ? `contrast-color(${fillColor})` : hue[textValue]
                        }
                        else {
                            cardStyle['backgroundColor'] = "transparent"
                            textColor = textValue == "auto" ? `contrast-color(${backgroundColor})` : hue[textValue]
                            cardVariant = "borderless"
                            className = "no-shadow"
                        }
                        let clipboardContent = {
                            "fillColor": fillColor,
                            "bordColor": bordColor,
                            // "textColor": textValue == 'auto' ? "#000000" : textColor,
                            "textColor": textColor
                        }
                        return (
                            <Card
                                className={className}
                                variant={cardVariant}
                                key={hueIdx}
                                styles={{
                                    body: {
                                        padding: 0,
                                        width: "100%",
                                        height: "100%",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        position: "relative"
                                    }
                                }}
                                style={cardStyle}
                            >
                                <Typography.Text style={{ color: textColor }}>color {alphabet[hueIdx]}</Typography.Text>
                                <OverlayComp clipboardContent={clipboardContent} />
                            </Card>
                        )
                    })
                }

            </div>
        </>
    )
}

function TypeSelector({ typeColor, IconComp }) {
    let [currentState, setCurrentState] = useContext(CurrentStateContext)
    let [currentDesign, setCurrentDesign] = useContext(CurrentDesignContext)

    function changeTypeColor(value) {
        let cloneState = JSON.parse(JSON.stringify(currentState))
        cloneState[currentDesign][typeColor] = value
        setCurrentState(cloneState)
    }
    return (
        <>
            <Segmented
                block
                orientation="vertical"
                styles={{
                    item: {
                        display: "flex",
                        alignItems: "center"
                    }
                }}
                style={{
                    height: cellHeight * currentState[currentDesign]['colors'][0].length
                }}
                value={currentState[currentDesign][typeColor]}
                onChange={(value) => { changeTypeColor(value) }}
                options={
                    currentState[currentDesign]['colors'][0].map((item, idx) => {
                        let label = typeColor == "fill" ? idx : alphabet[idx]
                        return { "value": idx, "label": <Typography.Text style={{ fontFamily: "Noto Sans Mono" }}>{typeColor} {idx}</Typography.Text>, "icon": IconComp }
                    })
                }
            />
        </>
    )
}

function ColorPalette() {
    let [currentState, setCurrentState] = useContext(CurrentStateContext)
    let [currentDesign, setCurrentDesign] = useContext(CurrentDesignContext)
    let copy = useCopyToClipboard()
    return (
        <>
            <div style={{ display: "flex" }}>
                {
                    currentState[currentDesign]['colors'].map((hue, hueIndex) => {
                        return (
                            <Card variant="borderless" key={hueIndex} style={{
                                width: cellWidth,
                                display: "flex",
                                flexShrink: 0,
                            }}>
                                {hue.map((tone, toneIndex) => {
                                    return (
                                        <Card.Grid
                                            className='no-shadow'
                                            onClick={() => {
                                                copy(tone)
                                            }}
                                            key={toneIndex}
                                            style={{
                                                cursor: "pointer", width: "100%", height: cellHeight, backgroundColor: tone, display: "flex", alignItems: "center", justifyContent: "center", padding: 0
                                            }}>
                                            <Typography.Text style={{ color: `contrast-color(${tone})`, fontFamily: "Noto Sans Mono" }}>
                                                {tone}
                                            </Typography.Text>
                                        </Card.Grid>
                                    )
                                })}
                            </Card>
                        )
                    })
                }
            </div>
        </>
    )

}

function AppLayout() {
    let [currentState, setCurrentState] = useContext(CurrentStateContext)
    let [currentDesign, setCurrentDesign] = useContext(CurrentDesignContext)
    let [backgroundColor, setBackgroundColor] = useContext(BackgroundColorContext)
    let [outlineColor, setOutlineColor] = useContext(OutlineColorContext)
    let [columnSide, setColumnSide] = useContext(ColumnSideContext)
    const gridStyle = {
        width: '25%',
        textAlign: 'center',
    };
    return (
        <>
            <Controller />
            <Card hoverable
                style={{
                    width: "fit-content",
                    height: "fit-content",
                    maxWidth: "100%",
                    backgroundColor: backgroundColor,
                    borderColor: outlineColor,
                    cursor: "default"
                }} styles={{
                    body: {
                        display: "flex",
                        justifyContent: "space-between",
                        gap: flexGap,
                        padding: `${flexGap}px ${flexGap}px 0px ${flexGap}px`
                    }
                }}>
                <div className='tableHeader' style={{
                    display: "flex", alignItems: 'center', flexShrink: 0, marginBottom: flexGap
                }}>
                    <TypeSelector typeColor={"fill"} IconComp={<BgColorsOutlined />} />
                </div>
                <div className='tableBody' style={{
                    display: "flex", flexDirection: "column", gap: flexGap, maxWidth: "100%", overflowX: "scroll", justifyContent: "flex-end"
                }}>
                    <DemoRow demoType={'box'} OverlayComp={OverlayBox} />
                    <ColorPalette />
                    <DemoRow demoType={'text'} OverlayComp={OverlayText} />
                </div>

                <div className='tableHeader' style={{
                    display: "flex", alignItems: 'center', flexShrink: 0, marginBottom: flexGap
                }}>
                    <TypeSelector typeColor={"bord"} IconComp={<BorderOuterOutlined />} />
                </div>
            </Card >
        </>
    )
}

function App() {
    let [modeTheme, setModeTheme] = useState("light")
    let [currentState, setCurrentState] = useState(null)
    let [currentDesign, setCurrentDesign] = useState(null)
    let [backgroundColor, setBackgroundColor] = useState(null)
    let [outlineColor, setOutlineColor] = useState(null)
    let [columnSide, setColumnSide] = useState(null)
    let [notificationApi, contextHolder] = notification.useNotification();
    useEffect(() => {
        let modeThemeStorage = localStorage.getItem("modeTheme")
        if (modeThemeStorage == "dark") {
            localStorage.setItem("modeTheme", "dark")
            setModeTheme("dark")
        }
        else {
            localStorage.setItem("modeTheme", "light")
            setModeTheme("light")
        }
        async function loadPalettes() {
            let jsonFile = await fetch("/color-palettes.json")
            let jsonObj = await jsonFile.json()
            setCurrentDesign(jsonObj['default'])
            setCurrentState(jsonObj['designs'])
            setColumnSide(jsonObj['column-side'])
            setBackgroundColor(jsonObj['background-color'])
            setOutlineColor(jsonObj['outline-color'])
        }
        loadPalettes()
    }, [])
    return (
        currentState ?
            <ConfigProvider theme={{
                algorithm: modeTheme == "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm,
                token: {
                    fontFamily: "Noto Sans"
                }
            }}>

                <ModeThemeContext.Provider value={{ modeTheme, setModeTheme }}>
                    <NotificationApiContext.Provider value={notificationApi}>
                        {contextHolder}
                        <CurrentStateContext.Provider value={[currentState, setCurrentState]}>
                            <CurrentDesignContext.Provider value={[currentDesign, setCurrentDesign]}>
                                <ColumnSideContext.Provider value={[columnSide, setColumnSide]}>
                                    <BackgroundColorContext.Provider value={[backgroundColor, setBackgroundColor]}>
                                        <OutlineColorContext.Provider value={[outlineColor, setOutlineColor]}>
                                            <AppLayout />
                                        </OutlineColorContext.Provider>
                                    </BackgroundColorContext.Provider>
                                </ColumnSideContext.Provider>
                            </CurrentDesignContext.Provider>
                        </CurrentStateContext.Provider>
                    </NotificationApiContext.Provider>
                </ModeThemeContext.Provider>
            </ConfigProvider>
            : <></>
    )
}

export default App
