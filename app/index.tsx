import { Link } from 'expo-router';
import { useState } from 'react';
import { View, StyleSheet, Text, Button } from 'react-native';
import DatePicker from 'react-native-modern-datepicker';
import { getFormatedDate } from 'react-native-modern-datepicker';

function Home() {
    const today = new Date();
    const startDate = getFormatedDate(today, 'YYYY/MM/DD');
    const [date, setDate] = useState(startDate);

    const handleChange = (selectedDate: string) => {
        setDate(selectedDate);
    };

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
                    <Text style={styles.boxText}>Nächstes Meeting:</Text>
                    <Text>Beispiel, Daten, XYZ</Text>
                </View>
                <View style={styles.box}>
                    <Text style={styles.boxText}>Offene Todos:</Text>
                    <Text>Beispiel, Daten, 1</Text>
                </View>
            </View>

            <View style={styles.buttonContainer}>
                <View style={styles.button}>
                    <Link href='/meetings' style={styles.buttonText}>Meetings</Link>
                </View>
                <View style={styles.button}>
                    <Link href='/todos' style={styles.buttonText}>To-do-Liste</Link>
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
        marginTop: '10%'
    },
    buttonText: {
        fontSize: 25,
    }
});

export default Home;