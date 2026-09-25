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
    Select
} from 'antd'

import { BgColorsOutlined, BorderOuterOutlined } from '@ant-design/icons'

let CurrentStateContext = createContext(null)
let CurrentDesignContext = createContext(null)
let cellWidth = 100
let cellHeight = 40
let flexGap = 12
let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

function OverLayBox() {
    return (
        <>
            <Card
                hoverable
                variant='borderless'
                styles={{
                    body: {
                        padding: 0,
                    }
                }}
                style={{
                    border: "0px",
                    height: "100%",
                    width: "50%",
                    backgroundColor: "transparent",
                    border: "0px",
                    boxShadow: "none"
                }}
            >
            </Card>
            <Card
                hoverable
                variant='borderless'
                styles={{
                    body: {
                        padding: 0
                    }
                }}
                style={{
                    border: "0px",
                    height: "100%",
                    width: "50%",
                    backgroundColor: "transparent",
                    border: "0px",
                    boxShadow: "none"
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
        { "value": 'auto', "label": 'auto' },
        { "value": 'black', "label": 'black' },
        { "value": 'white', "label": 'white' },
    ]
    let textChoices2 = Array.from({ length: currentState[currentDesign]['colors'][0].length }, (_, i) => ({ "value": i, "label": `tone ${i}` }));
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

function DemoRow({ demoType }) {
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
                        let textColor = "black"
                        if (textValue == 'auto') {
                            textColor = `contrast-color(${fillColor})`
                        }
                        else if (typeof textValue == "string") {
                            textColor = textValue
                        }
                        else {
                            textColor = hue[textValue]
                        }
                        if (demoType == 'box') {
                            cardStyle['backgroundColor'] = fillColor
                            cardStyle['borderColor'] = bordColor
                            cardVariant = "outlined"
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
                                        display: "flex", alignItems: "center", justifyContent: "center"
                                    }
                                }}
                                style={cardStyle}
                            >
                                <Typography.Text style={{ color: textColor }}>color {alphabet[hueIdx]}</Typography.Text>
                            </Card>
                        )
                    })
                }

            </div>
        </>
    )
}

function TypeSelector({ typeColor, iconElement }) {
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
                        return { "value": idx, "label": `${typeColor} ${idx}`, "icon": iconElement }
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
    let [currentDesign, setCurrentDesign] = useContext(CurrentStateContext)
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
                <DemoRow demoType={'text'} />
            </div>
            <div className='tableBody' style={{ display: "flex", gap: flexGap, marginBottom: flexGap }}>
                {/* <div style={{ minWidth: cellWidth }}> */}
                <TypeSelector typeColor={"fill"} iconElement={<BgColorsOutlined />} />
                {/* </div> */}
                <ColorPalette />
                <TypeSelector typeColor={"border"} iconElement={<BorderOuterOutlined />} />
            </div>
            <div className='tableFooter' style={{ display: "flex", gap: flexGap, marginBottom: flexGap }}>
                <div style={{ minWidth: cellWidth, height: cellHeight }}></div>
                <DemoRow demoType={'box'} />
            </div>
        </>
    )
}

function App() {
    let [currentState, setCurrentState] = useState(null)
    let [currentDesign, setCurrentDesign] = useState(null)
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
            <CurrentStateContext.Provider value={[currentState, setCurrentState]}>
                <CurrentDesignContext.Provider value={[currentDesign, setCurrentDesign]}>
                    <AppLayout />
                </CurrentDesignContext.Provider>
            </CurrentStateContext.Provider>
            : <></>
    )
}

export default App
