import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  StatusBar,
  Vibration,
} from "react-native";
import Note from "../components/Note";
import { useState, useEffect } from "react";
import { AntDesign } from "@expo/vector-icons";
import { EvilIcons, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
export default function Home({ navigation, route }) {
  const [notes, setNotes] = useState([]);
  const [pinnedItems, setPinnedItems] = useState([]);
  const [searchedTerm, setSearchedTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // for multi selecting
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  // Refreshing on Focus
  const isFocused = useIsFocused();

  // for asyncstorage
  const storeData = async (notes) => {
    try {
      const jsonValue = JSON.stringify(notes);
      await AsyncStorage.setItem("@notes", jsonValue);
    } catch (e) {
      // saving error
    }
  };

  // getting notes list from Asyncstorage
  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("@notes");
      const data = JSON.parse(jsonValue) || [];
      // for sorting pinned notes
      const sortpinned = data.filter((item) => item.pinned);
      setPinnedItems(sortpinned);
      setNotes(data);
    } catch (e) {
      // error reading value
    }
  };
  // getData at startup
  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (isFocused) {
      // Fetch data or trigger any function here
      getData();
    }
  }, [isFocused]);

  // effect when user typed in search if empty no change
  useEffect(() => {
    handleSearch(searchedTerm);
  }, [searchedTerm]);

  // for selection functions

  // delete Button bulk selection
  const handleDeleteButton = () => {
    let selected = selectedItems;
    let list = notes;
    list = list.filter((item) => !selected.includes(item.id));
    storeData(list);
    getData();
    setIsSelecting(false);
    vibrate();
  };

  // Update and Edit storing and getting notes
  // useEffect(() => {
  //   // create
  //   let newNote = route.params?.Note;
  //   if (newNote) {
  //     storeData([...Notes, newNote]);
  //     newNote = "";
  //     getData();
  //   }

  // }, [route.params]);

  // delete from NoteEdit
  const handleDeleteNote = (id) => {
    const updateNotes = notes.filter((one) => one.id != id);
    storeData(updateNotes);
    getData();
  };

  // search handling function
  const handleSearch = (_searchTerm) => {
    let copy = notes;
    let search = copy.filter((item) => item.title.includes(_searchTerm));
    setSearchResults(search);
  };

  // multi selection handling for storing ids in selected Items
  const handleSelection = (id, action) => {
    if (action == "add") {
      let list = selectedItems;
      list.push(id);
      setSelectedItems(list);
    } else if (action == "remove") {
      let list = selectedItems;
      list.pop(id);
      setSelectedItems(list);
    }
  };

  // update note / Note
  const updateNote = (newNote) => {
    let _newTemp = notes;
    _newTemp.map((note) => {
      if (note.id == newNote.id) {
        note.title = newNote.title;
        note.note = newNote.note;
        note.starred = newNote.starred;
        note.pinned = newNote.pinned;
      }
    });

    storeData(_newTemp);
    getData();
  };
  const vibrate = () => {
    Vibration.vibrate(1 * 50);
  };

  return (
    <View style={styles.container}>
      <StatusBar
        animated={true}
        backgroundColor="#FBFCFD"
        barStyle={"dark-content"}
        // showHideTransition={statusBarTransition}
        // hidden={"true"}
      />
      <View style={styles.homeContainer}>
        {/* search bar component */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <TextInput
              onChangeText={setSearchedTerm}
              style={styles.searchText}
              placeholder="Search Note"
              value={searchedTerm}
            ></TextInput>
          </View>
        </View>
        {/* chip component */}
        <View style={styles.chipsContainer}>
          <ScrollView
            bouncesZoom={true}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          >
            {!isSelecting ? (
              <>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[styles.chipItem]}
                  onPress={() => {
                    navigation.navigate("Starred");
                    vibrate();
                  }}
                >
                  {/* <AntDesign
                    name="staro"
                    size={20}
                    color="#687076"
                    style={{ alignSelf: "center" }}
                  /> */}
                  <Text style={styles.chipText}>Favourites</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.chipItem}
                  onPress={() => {
                    navigation.navigate("Codes");
                    vibrate();
                  }}
                >
                  <Text style={styles.chipText}>Codes</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.chipItem}
                  onPress={() => {
                    navigation.navigate("Todoer");
                    vibrate();
                  }}
                >
                  <Text style={styles.chipText}>Todoer</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.chipItem}
                  onPress={() => {
                    setIsSelecting(true);
                    vibrate();
                  }}
                >
                  <Ionicons
                    name="md-checkmark-circle"
                    size={20}
                    color="#687076"
                  />
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.chipItem}
                  onPress={handleDeleteButton}
                >
                  <Text style={styles.chipText}>Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.chipItem}
                  onPress={() => {
                    setSelectedItems([]);
                    setIsSelecting(false);
                    vibrate();
                  }}
                >
                  <Ionicons
                    name="md-close-circle-sharp"
                    size={20}
                    color="#687076"
                  />
                </TouchableOpacity>
              </>
            )}
          </ScrollView>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Message info */}
          {notes.length == 0 && pinnedItems.length == 0 && (
            <Text style={styles.infoText}>
              Your list is currently empty! {"\n"}
            </Text>
          )}
          {/* pinned items */}
          {!searchedTerm && pinnedItems.length != 0 && (
            <Text style={styles.viewText}>
              Pinned
              <MaterialCommunityIcons name="pin" size={18} color="#687076" />
            </Text>
          )}
          {/* search results */}
          {searchedTerm && (
            <Text style={styles.viewText}>
              Searched Results
              <EvilIcons name="search" size={20} color="#687076" />
            </Text>
          )}

          {!searchedTerm &&
            pinnedItems.map((item) => (
              <Note
                title={item.title}
                note={item.note}
                navigation={navigation}
                id={item.id}
                key={item.id}
                deletion={handleDeleteNote}
                starred={item.starred}
                pinned={item.pinned}
              />
            ))}
          {/* seperator */}
          {pinnedItems.length != 0 && <View style={styles.separator}></View>}
          {/* notes/ notes */}
          {!searchedTerm &&
            notes.map((item) => {
              if (!item.pinned) {
                return (
                  <Note
                    title={item.title}
                    note={item.note}
                    navigation={navigation}
                    id={item.id}
                    key={item.id}
                    deletion={handleDeleteNote}
                    starred={item.starred}
                    pinned={item.pinned}
                    isSelection={isSelecting}
                    setSelectedList={handleSelection}
                  />
                );
              }
            })}

          {/*if the search bar is not empty */}
          {searchedTerm &&
            searchResults.map((item) => (
              <Note
                title={item.title}
                note={item.note}
                navigation={navigation}
                id={item.id}
                key={item.id}
                deletion={handleDeleteNote}
                starred={item.starred}
                pinned={item.pinned}
              />
            ))}
        </ScrollView>
        {/* Add Section */}
        <View style={styles.newNoteContainer}>
          <View style={styles.newNoteBar}>
            <Text
              onPress={() => navigation.navigate("NoteInput")}
              style={styles.newNoteText}
            >
              New Note?
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FBFCFD",
    alignItems: "center",
    justifyContent: "center",
  },
  homeContainer: {
    flex: 1,
    backgroundColor: "#FBFCFD",
    width: "100%",
    padding: 15,
    paddingTop: 10,
  },
  searchContainer: {
    // width: "100%",
    // height: 20,
  },
  searchBar: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: "#DFE3E6",
  },
  searchText: {
    fontSize: 20,
    color: "#DFE3E6",
    color: "#687076",
    fontWeight: "semibold",
    fontFamily: "Inter_400Regular",
  },
  newNoteBar: {
    width: "100%",
    backgroundColor: "#DFE3E6",
    padding: 10,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: "#DFE3E6",
    marginTop: 9,
  },
  newNoteText: {
    fontSize: 20,
    color: "#687076",
    fontWeight: "medium",
    fontFamily: "Inter_400Regular",
  },
  chipsContainer: {
    flexDirection: "row",
    marginVertical: 9,
  },
  chipItem: {
    backgroundColor: "#DFE3E6",
    marginRight: 15,
    borderRadius: 11,
    paddingVertical: 6,
    paddingHorizontal: 9,
  },
  chipText: {
    color: "#687076",
    fontSize: 15,
    fontWeight: "600",
    fontFamily: "Inter_500Medium",
  },
  chipSelected: {
    borderWidth: 2,
    borderColor: "#687076",
  },
  NoteView: {
    width: "10%",
    flex: 1,
  },
  viewText: {
    color: "#687076",
    fontSize: 15,
    fontWeight: "600",
    fontFamily: "Inter_500Medium",
    marginBottom: 2,
  },
  separator: {
    height: 1,
    borderBottomWidth: 0.8,
    borderBottomColor: "#DFE3E6",
    marginBottom: 10,
  },
  infoText: {
    fontFamily: "Inter_400Regular",
    fontSize: 18,
    alignSelf: "center",
    justifyContent: "center",
    textAlign: "center",
    color: "#687076",
    marginTop:20
  },
  buttonExample: {
    backgroundColor: "#DFE3E6",
    borderRadius: 11,
    // padding: 5,
    paddingVertical: 6,
    paddingHorizontal: 9,
  },
  buttonExampleText: {
    color: "#687076",
    fontSize: 15,
    fontWeight: "600",
    fontFamily: "Inter_500Medium",
  },
});
