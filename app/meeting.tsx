import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const Meeting = () => {
    const [timeStart, setTimeStart] = useState('');
    const [timeEnd, setTimeEnd] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [reminder, setReminder] = useState('');
    const navigation = useNavigation();

    const saveMeeting = async () => {
        if (timeStart === '' || timeEnd === '' || title === '' || reminder === '') {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        try {
            const meeting = { 
                id: Date.now().toString(),
                timeStart,
                timeEnd,
                title,
                description,
                reminder
            };
            const existingMeetings = await AsyncStorage.getItem('meetings');
            const meetings = existingMeetings ? JSON.parse(existingMeetings) : [];
            meetings.push(meeting);

            await AsyncStorage.setItem('meetings', JSON.stringify(meetings));
            Alert.alert('Gespeichert', 'Meeting erfolgreich gespeichert');
            navigation.goBack();  // Gehe zurück zur Meeting-Liste-Seite
        } catch (error) {
            Alert.alert('Error', 'Fehler beim Speichern vom Meeting');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Tagesplaner</Text>
            <Text style={styles.date}>13.01.2022</Text>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Zeit:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Startzeit (z.B. 08:00)"
                    value={timeStart}
                    onChangeText={setTimeStart}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Endzeit (z.B. 10:00)"
                    value={timeEnd}
                    onChangeText={setTimeEnd}
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Titel:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Meeting-Titel"
                    value={title}
                    onChangeText={setTitle}
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Beschreibung:</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Beschreibung..."
                    multiline={true}
                    numberOfLines={4}
                    value={description}
                    onChangeText={setDescription}
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Erinnerung:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Erinnerungszeit (z.B. 09:45)"
                    value={reminder}
                    onChangeText={setReminder}
                />
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={saveMeeting}>
                    <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={() => Alert.alert('Meeting gelöscht')}>
                    <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: 'white',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    date: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 20,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    button: {
        padding: 15,
        borderRadius: 5,
        width: '40%',
        alignItems: 'center',
    },
    saveButton: {
        backgroundColor: 'green',
    },
    deleteButton: {
        backgroundColor: 'red',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default Meeting;
