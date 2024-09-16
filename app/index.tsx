import { Link } from 'expo-router';
import { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Alert } from 'react-native';
import DatePicker from 'react-native-modern-datepicker';
import { getFormatedDate } from 'react-native-modern-datepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

function Home() {
    const today = new Date();
    const startDate = getFormatedDate(today, 'YYYY/MM/DD');
    const [date, setDate] = useState(startDate);
    const [todos, setTodos] = useState([]);
    const [meetings, setMeetings] = useState([]);
    const navigation = useNavigation();

    const handleChange = (selectedDate: string) => {
        setDate(selectedDate);
    };

    useEffect(() => {
        const loadTodos = async () => {
            try {
                const storedTodos = await AsyncStorage.getItem(date);
                if (storedTodos) {
                    setTodos(JSON.parse(storedTodos));
                } else {
                    setTodos([]);
                }
            }
            catch (error) {
                Alert.alert('Error', 'Fehler beim Laden der Todos');
                setTodos([]);
            }
        };

        loadTodos();

        const unsubscribe = navigation.addListener('focus', loadTodos);
        return unsubscribe;
    }, [date]);

    useEffect(() => {
        const loadMeetings = async () => {
            try {
                const storedMeetings = await AsyncStorage.getItem(date + "/meetings");
                if (storedMeetings) {
                    setMeetings(JSON.parse(storedMeetings));
                } else {
                    setMeetings([]);
                }
            }
            catch (error) {
                Alert.alert('Error', 'Fehler beim Laden der Meetings');
                setMeetings([]);
            }
        };

        loadMeetings();

        const unsubscribe = navigation.addListener('focus', loadMeetings);
        return unsubscribe;
    }, [date]);

    return (
        <View style={styles.container}>
            <View style={styles.datePickerContainer}>
                <DatePicker
                    mode='calendar'
                    selected={date}
                    onDateChange={handleChange}
                />
            </View>

            <Text style={styles.selectedDate}>{date}</Text>

            <View style={styles.boxContainer}>
                <View style={styles.box}>
                    <Text style={styles.boxText}>Meetings:</Text>
                    <Text>{meetings.length} {meetings.length === 1 ? 'ist' : 'sind'} für diesen Tag noch offen</Text>
                </View>
                <View style={styles.box}>
                    <Text style={styles.boxText}>Todos:</Text>
                    <Text>{todos.length} {todos.length === 1 ? 'ist' : 'sind'} für diesen Tag noch offen</Text>
                </View>
            </View>

            <View style={styles.buttonContainer}>
                <View style={styles.button}>
                    <Link href={`/meetings?date=${date}`} style={styles.buttonText}>Meetings</Link>
                </View>
                <View style={styles.button}>
                    <Link href={`/todos?date=${date}`} style={styles.buttonText}>To-do-Liste</Link>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    datePickerContainer: {
        position: 'absolute',
        left: 1,
        right: 1,
        backgroundColor: 'white',
        padding: 5,
        elevation: 10,
    },
    selectedDate: {
        fontSize: 25,
        marginTop: '100%',
        marginLeft: 5,
    },
    boxContainer: {
        marginLeft: 5,
    },
    box: {
        borderColor: 'black',
        borderWidth: 2,
        padding: 15,
        marginVertical: 5,
        marginRight: 5,
        borderRadius: 25,
        marginTop: 20
    },
    boxText: {
        color: 'black',
        fontSize: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    button: {
        borderColor: 'black',
        borderWidth: 2,
        padding: 15,
        marginVertical: 5,
        marginRight: 5,
        borderRadius: 25,
        backgroundColor: '#55D7F9',
        width: '45%',
        marginTop: '9%'
    },
    buttonText: {
        fontSize: 25,
        textAlign: 'center'
    }
});

export default Home;