import { StyleSheet, Text, TouchableOpacity, View,Keyboard } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TextInput } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";
import { useState, useRef, useEffect } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
const NoteInput = ({ navigation }) => {
    const [storage,setStorage] = useState([])
    const [isPinned, setIsPinned] = useState(false);
    const [isStarred, setIsStarred] = useState(false);
    const [title, setTitle] = useState("");
    const [note, setNote] = useState("");
    const titleInputRef = useRef(null);

    const now = new Date();
    const id = now.getTime();
    const handleBack = () => {
        navigation.goBack();
    };
    const handlePinned = () => {
        setIsPinned(!isPinned);
    };
    const handleStarred = () => {
        setIsStarred(!isStarred);
    };

    // for handling the create button functionality
    const handleCreate = () => {
        CreateNote()
        navigation.goBack()
        Keyboard.dismiss()

        // if (title) {
        //     CreateNote()
        //     navigation.goBack()
        // } else if (note) {
        //     CreateNote()
        //     navigation.goBack()
        //     Keyboard.dismiss()

        // } else {
        //     //
        //     Keyboard.dismiss()

        // }
    };

    const getData  = async() => {
        const data = await AsyncStorage.getItem("@notes");
        const dataJson = JSON.parse(data) || []
        setStorage(dataJson)
    }

    const CreateNote = () => {
        const data = {
            title: title,
            note: note,
            id: id,
            starred: isStarred,
            pinned: isPinned,
            selected:false
        }
        let dataPrevious = storage
        dataPrevious.push(data)
        saveToStorage(dataPrevious)

    }

    const saveToStorage = async (_storage) => {
        const _storageString = JSON.stringify(_storage)
        await AsyncStorage.setItem("@notes",_storageString)
    }

    useEffect(() => {
        titleInputRef.current?.focus();
        getData()
    },[])
    return (
        <View style={styles.container}>
            <View style={styles.InputContainer}>
                {/* Header */}
                <View style={styles.headerContainer}>
                    <AntDesign
                        name="arrowleft"
                        size={28}
                        color="black"
                        style={{ marginRight: 10 }}
                        onPress={() => handleBack()}
                    />
                    <Text style={styles.headerText}>New Note?</Text>
                    {(title || note) && <TouchableOpacity
                        style={styles.button}
                        onPress={handleCreate}
                        disabled={!title && !note}
                    >
                        <Text style={styles.buttonText}>Create</Text>
                    </TouchableOpacity>}
                    <TouchableOpacity
                        style={styles.headerIcons}
                        onPress={handlePinned}
                    >
                        <MaterialCommunityIcons
                            name={isPinned ? "pin-off" : "pin"}
                            size={28}
                            color="black"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.headerIcons}
                        onPress={handleStarred}
                    >
                        <AntDesign
                            name={isStarred ? "star" : "staro"}
                            size={28}
                            color="black"
                            style={{ alignSelf: "center" }}
                        />
                    </TouchableOpacity>
                </View>
                {/* Input */}
                <View style={styles.NewNoteContainer}>
                    <TextInput
                        ref={titleInputRef}
                        style={styles.inputTitle}
                        placeholder="Title"
                        multiline={true}
                        numberOfLines={2}
                        textAlignVertical="top"
                        maxLength={100}
                        onChangeText={setTitle}
                        value={title}
                    ></TextInput>
                    <TextInput
                        style={styles.inputNote}
                        placeholder="Note"
                        multiline={true}
                        numberOfLines={11}
                        textAlignVertical="top"
                        onChangeText={setNote}
                        value={note}
                    ></TextInput>
                </View>
            </View>
        </View>
    );
};
export default NoteInput;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FBFCFD",
        alignItems: "center",
        justifyContent: "center",
    },
    InputContainer: {
        flex: 1,
        backgroundColor: "#FBFCFD",
        width: "100%",
        padding: 10,
        paddingTop: 10,
    },
    headerContainer: {
        width: "100%",
        alignItems: "center",
        justifyContent: "flex-start",
        flexDirection: "row",
        height: 50,
    },
    headerText: {
        fontFamily: "Inter_500Medium",
        fontSize: 21,
        flex: 1,
    },
    headerIcons: {
        marginLeft: 5,
    },
    NewNoteContainer: {
        flex: 1,
        width: "100%",
        borderWidth: 1,
        backgroundColor: "#fff",
        padding: 10,
        borderRadius: 11,
        borderWidth: 1,
        borderColor: "#DFE3E6",
    },
    inputTitle: {
        fontFamily: "Inter_400Regular",
        fontSize: 20,
        textAlign: "left",
        alignItems: "flex-start",
        alignContent: "flex-start",
        marginBottom: 20,
    },
    inputNote: {
        fontFamily: "Inter_400Regular",
        fontSize: 15,
    },
    button: {
        backgroundColor: "#DFE3E6",
        paddingVertical: 6,
        paddingHorizontal: 9,
        borderRadius: 7,
    },
    buttonText: {
        fontSize: 15,
        fontFamily: "Inter_500Medium",
    },
});
