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
    message
} from 'antd'

import { BgColorsOutlined, BorderOuterOutlined } from '@ant-design/icons'

let CurrentStateContext = createContext(null)
let CurrentDesignContext = createContext(null)
let MessageApiContext = createContext(null)

let cellWidth = 100
let cellHeight = 40
let flexGap = 12
let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

async function copyToClipboard(text, messageApi) {
    await navigator.clipboard.writeText(text);
    messageApi.info(`Copy ${text}`);
}

function OverlayBox({ clipboardContent }) {
    let messageApi = useContext(MessageApiContext)
    return (
        <>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%", position: "absolute", zIndex: 1 }}>
                <Card
                    onClick={() => {
                        console.log(clipboardContent)
                        copyToClipboard(clipboardContent['fillColor'], messageApi)
                    }}
                    className='overlay-card'
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
                    className='overlay-card'
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
    return (
        <>
            <Card
                className='overlay-card'
                hoverable
                variant='borderless'
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
            <div style={{ display: "flex", alignItems: "center", gap: flexGap }}>
                <Select
                    value={currentDesign}
                    style={{ width: 120 }}
                    onChange={(val) => { setCurrentDesign(val) }}
                    options={Object.keys(currentState).map((key) => {
                        return { "value": key, "label": key }
                    })}
                />
                <Select
                    value={currentState[currentDesign]['text']}
                    style={{ width: 120 }}
                    onChange={(val) => { changeTextChoice(val) }}
                    options={textChoices}
                />

            </div>
        </>
    )
}

function DemoRow({ demoType, OverlayComp }) {
    let [currentState, setCurrentState] = useContext(CurrentStateContext)
    let [currentDesign, setCurrentDesign] = useContext(CurrentDesignContext)
    return (
        <>
            <div style={{
                display: "flex",
                justifyContent: "space-around",
                minWidth: cellWidth * currentState[currentDesign]['colors'].length
            }}>
                {
                    currentState[currentDesign]['colors'].map((hue, hueIdx) => {
                        let cardStyle = {
                            width: 0.9 * cellWidth, height: cellHeight
                        }
                        let textValue = currentState[currentDesign]['text']
                        let fillColor = hue[currentState[currentDesign]["fill"]]
                        let bordColor = hue[currentState[currentDesign]["border"]]
                        let cardVariant = "borderless"
                        let textColor = "auto"
                        if (textValue == 'auto') {
                            textColor = `contrast-color(${fillColor})`
                            console.log("textColor", textColor)
                        }
                        else {
                            textColor = hue[textValue]
                        }
                        if (demoType == 'box') {
                            cardStyle['backgroundColor'] = fillColor
                            cardStyle['borderColor'] = bordColor
                            cardVariant = "outlined"
                        }
                        let clipboardContent = {
                            "fillColor": fillColor,
                            "bordColor": bordColor,
                            "textColor": textValue == 'auto' ? "#000000" : textColor
                        }
                        return (
                            <Card
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
                    minWidth: cellWidth
                }}
                value={currentState[currentDesign][typeColor]}
                onChange={(value) => { changeTypeColor(value) }}
                options={
                    currentState[currentDesign]['colors'][0].map((item, idx) => {
                        let label = typeColor == "fill" ? idx : alphabet[idx]
                        return { "value": idx, "label": `${typeColor} ${idx}`, "icon": IconComp }
                    })
                }
            />
        </>
    )
}

function ColorPalette() {
    let [currentState, setCurrentState] = useContext(CurrentStateContext)
    let [currentDesign, setCurrentDesign] = useContext(CurrentDesignContext)
    return (
        <>
            <div style={{ display: "flex" }}>
                {
                    currentState[currentDesign]['colors'].map((hue, hueIndex) => {
                        return (
                            <Card variant="borderless" key={hueIndex} style={{
                                width: cellWidth,
                                display: "flex"
                            }}>
                                {hue.map((tone, toneIndex) => {
                                    return (
                                        <Card.Grid key={toneIndex} style={{
                                            cursor: "pointer", width: "100%", height: cellHeight, backgroundColor: tone, display: "flex", alignItems: "center", justifyContent: "center", padding: 0
                                        }}>
                                            <Typography.Text style={{ color: `contrast-color(${tone})` }}>
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
    const gridStyle = {
        width: '25%',
        textAlign: 'center',
    };
    return (
        <>
            <div className='controller' style={{ display: "flex", gap: flexGap, marginBottom: flexGap }}>
                <div style={{ minWidth: cellWidth, height: cellHeight }}></div>
                <Controller />
            </div>
            <div className='tableHeader' style={{ display: "flex", gap: flexGap, marginBottom: flexGap }}>
                <div style={{ minWidth: cellWidth, height: cellHeight }}></div>
                <DemoRow demoType={'text'} OverlayComp={OverlayText} />
            </div>
            <div className='tableBody' style={{ display: "flex", gap: flexGap, marginBottom: flexGap }}>
                {/* <div style={{ minWidth: cellWidth }}> */}
                <TypeSelector typeColor={"fill"} IconComp={<BgColorsOutlined />} />
                {/* </div> */}
                <ColorPalette />
                <TypeSelector typeColor={"border"} IconComp={<BorderOuterOutlined />} />
            </div>
            <div className='tableFooter' style={{ display: "flex", gap: flexGap, marginBottom: flexGap }}>
                <div style={{ minWidth: cellWidth, height: cellHeight }}></div>
                <DemoRow demoType={'box'} OverlayComp={OverlayBox} />
            </div>
        </>
    )
}

function App() {
    let [currentState, setCurrentState] = useState(null)
    let [currentDesign, setCurrentDesign] = useState(null)
    let [messageApi, contextHolder] = message.useMessage();
    useEffect(() => {
        async function loadPalettes() {
            let jsonFile = await fetch("/color-palettes.json")
            let jsonObj = await jsonFile.json()
            setCurrentDesign(jsonObj['default'])
            setCurrentState(jsonObj['designs'])
        }
        loadPalettes()
    }, [])
    return (
        currentState ?
            <MessageApiContext.Provider value={messageApi}>
                {contextHolder}
                <CurrentStateContext.Provider value={[currentState, setCurrentState]}>
                    <CurrentDesignContext.Provider value={[currentDesign, setCurrentDesign]}>
                        <AppLayout />
                    </CurrentDesignContext.Provider>
                </CurrentStateContext.Provider>
            </MessageApiContext.Provider>
            : <></>
    )
}

export default App
