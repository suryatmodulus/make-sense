import React, {useState} from 'react'
import './LoadLabelsPopup.scss'
import {AppState} from "../../../store";
import {connect} from "react-redux";
import {updateActiveLabelIndex, updateLabelNamesList} from "../../../store/editor/actionCreators";
import {GenericYesNoPopup} from "../GenericYesNoPopup/GenericYesNoPopup";
import {PopupWindowType} from "../../../data/PopupWindowType";
import {updateActivePopupType} from "../../../store/general/actionCreators";
import {useDropzone} from "react-dropzone";
import {FileUtil} from "../../../utils/FileUtil";

interface IProps {
    updateActiveLabelIndex: (activeLabelIndex: number) => any;
    updateLabelNamesList: (labelNames: string[]) => any;
    updateActivePopupType: (activePopupType: PopupWindowType) => any;
}

const LoadLabelsPopup: React.FC<IProps> = ({updateActiveLabelIndex, updateLabelNamesList, updateActivePopupType}) => {
    const [labelsList, setLabelsList] = useState([]);
    const [invalidFileLoadedStatus, setInvalidFileLoadedStatus] = useState(false);
    const {acceptedFiles, getRootProps, getInputProps} = useDropzone({
        accept: 'text/plain',
        multiple: false,
        onDrop: (acceptedFiles) => {
            if (acceptedFiles.length === 1) {
                FileUtil.loadLabelsList(acceptedFiles[0], onSuccess, onFailure);
            }
        }
    });

    const onSuccess = (labelsList: string[]) => {
        setLabelsList(labelsList);
        setInvalidFileLoadedStatus(false);
    };

    const onFailure = () => {
        setInvalidFileLoadedStatus(true);
    };

    const onAccept = () => {
        if (labelsList.length > 0) {
            updateActiveLabelIndex(0);
            updateLabelNamesList(labelsList);
            updateActivePopupType(null);
        }
    };

    const onReject = () => {
        updateActivePopupType(null);
    };

    const getDropZoneContent = () => {
        if (invalidFileLoadedStatus)
            return <>
                <input {...getInputProps()} />
                <img alt={"upload"} src={"img/box-opened.png"}/>
                <p className="extraBold">Loading of labels file was unsuccessful</p>
                <p className="extraBold">Try again</p>
            </>;
        else if (acceptedFiles.length === 0)
            return <>
                <input {...getInputProps()} />
                <img alt={"upload"} src={"img/box-opened.png"}/>
                <p className="extraBold">Drop labels file</p>
                <p>or</p>
                <p className="extraBold">Click here to select it</p>
            </>;
        else if (labelsList.length === 1)
            return <>
                <img alt={"uploaded"} src={"img/box-closed.png"}/>
                <p className="extraBold">only 1 label found</p>
            </>;
        else
            return <>
                <img alt={"uploaded"} src={"img/box-closed.png"}/>
                <p className="extraBold">{labelsList.length} labels found</p>
            </>;
    };

    const renderContent = () => {
        return(<div className="LoadLabelsPopupContent">
            <div className="Message">
                Before you start, please load a text file with a list of labels you are planning to use. The names of
                each label should be separated by new line. If you don't have a prepared file, no problem. You can
                create your own list during the labeling process.
            </div>
            <div {...getRootProps({className: 'DropZone'})}>
                {getDropZoneContent()}
            </div>
        </div>);
    };

    return(
        <GenericYesNoPopup
            title={"Load file with labels description"}
            renderContent={renderContent}
            acceptLabel={"Load"}
            onAccept={onAccept}
            rejectLabel={"Create along the way"}
            onReject={onReject}
        />
    );
};

const mapDispatchToProps = {
    updateActiveLabelIndex,
    updateLabelNamesList,
    updateActivePopupType,
};

const mapStateToProps = (state: AppState) => ({});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LoadLabelsPopup);