import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useLocalSearchParams } from 'expo-router';
import DateTimePicker from 'react-native-modal-datetime-picker';

interface Meeting {
    id: string;
    timeStart: string;
    timeEnd: string;
    title: string;
    description?: string;
    reminder?: string;
}

const Meeting = () => {
    const { selectedDate, meetingId } = useLocalSearchParams<{ selectedDate: string; meetingId: string }>();
    const [timeStart, setTimeStart] = useState<string>('');
    const [timeEnd, setTimeEnd] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [reminder, setReminder] = useState<string>('');
    const [isTimeStartPickerVisible, setTimeStartPickerVisibility] = useState(false);
    const [isTimeEndPickerVisible, setTimeEndPickerVisibility] = useState(false);
    const [isReminderPickerVisible, setReminderPickerVisibility] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        const loadMeeting = async () => {
            if (selectedDate && meetingId) {
                try {
                    const storedMeetings = await AsyncStorage.getItem(selectedDate + "/meetings");
                    if (storedMeetings) {
                        const meetings: Meeting[] = JSON.parse(storedMeetings);
                        const meeting = meetings.find(m => m.id === meetingId);
                        if (meeting) {
                            setTimeStart(meeting.timeStart);
                            setTimeEnd(meeting.timeEnd);
                            setTitle(meeting.title);
                            setDescription(meeting.description || '');
                            setReminder(meeting.reminder || '');
                        }
                    }
                } catch (error) {
                    Alert.alert('Error', 'Fehler beim Laden des Meetings');
                }
            }
        };

        loadMeeting();
    }, [selectedDate, meetingId]);

    const handleTimeStartPicked = (date: Date) => {
        setTimeStart(date.toISOString());
        setTimeStartPickerVisibility(false);
    };

    const handleTimeEndPicked = (date: Date) => {
        setTimeEnd(date.toISOString());
        setTimeEndPickerVisibility(false);
    };

    const handleReminderPicked = (date: Date) => {
        setReminder(date.toISOString());
        setReminderPickerVisibility(false);
    };

    const saveMeeting = async () => {
        if (timeStart === '' || timeEnd === '' || title === '' || reminder === '') {
            Alert.alert('Error', 'Bitte füllen Sie alle Felder aus');
            return;
        }

        try {
            const meeting: Meeting = {
                id: meetingId || Date.now().toString(),
                timeStart,
                timeEnd,
                title,
                description,
                reminder,
            };

            if (selectedDate) {
                const storedMeetings = await AsyncStorage.getItem(selectedDate + "/meetings");
                const meetings: Meeting[] = storedMeetings ? JSON.parse(storedMeetings) : [];
                const index = meetings.findIndex(m => m.id === meeting.id);
                if (index !== -1) {
                    meetings[index] = meeting;
                } else {
                    meetings.push(meeting);
                }
                await AsyncStorage.setItem(selectedDate + "/meetings", JSON.stringify(meetings));
                Alert.alert('Gespeichert', 'Meeting erfolgreich gespeichert');
            }

            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', 'Fehler beim Speichern des Meetings');
        }
    };

    const deleteMeeting = async () => {
        try {
            if (selectedDate && meetingId) {
                const storedMeetings = await AsyncStorage.getItem(selectedDate + "/meetings");
                if (storedMeetings) {
                    const meetings: Meeting[] = JSON.parse(storedMeetings);
                    const updatedMeetings = meetings.filter(m => m.id !== meetingId);
                    await AsyncStorage.setItem(selectedDate + "/meetings", JSON.stringify(updatedMeetings));
                    Alert.alert('Gelöscht', 'Meeting erfolgreich gelöscht');
                    navigation.goBack();
                }
            }
        } catch (error) {
            Alert.alert('Error', 'Fehler beim Löschen des Meetings');
        }
    };

    const formatTime = (isoDate: string) => {
        if (!isoDate) {
            return '';
        }
        const date = new Date(isoDate);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };


    return (
        <View style={styles.container}>
            <Text style={styles.header}>{selectedDate}</Text>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Startzeit:</Text>
                <TouchableOpacity onPress={() => setTimeStartPickerVisibility(true)}>
                    <Text style={styles.input}>{formatTime(timeStart) || 'Startzeit wählen'}</Text>
                </TouchableOpacity>
                <DateTimePicker
                    isVisible={isTimeStartPickerVisible}
                    mode="time"
                    onConfirm={handleTimeStartPicked}
                    onCancel={() => setTimeStartPickerVisibility(false)}
                />
                <Text style={styles.label}>Endzeit:</Text>
                <TouchableOpacity onPress={() => setTimeEndPickerVisibility(true)}>
                    <Text style={styles.input}>{formatTime(timeEnd) || 'Endzeit wählen'}</Text>
                </TouchableOpacity>
                <DateTimePicker
                    isVisible={isTimeEndPickerVisible}
                    mode="time"
                    onConfirm={handleTimeEndPicked}
                    onCancel={() => setTimeEndPickerVisibility(false)}
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
                <TouchableOpacity onPress={() => setReminderPickerVisibility(true)}>
                    <Text style={styles.input}>{formatTime(reminder) || 'Erinnerung wählen'}</Text>
                </TouchableOpacity>
                <DateTimePicker
                    isVisible={isReminderPickerVisible}
                    mode="time"
                    onConfirm={handleReminderPicked}
                    onCancel={() => setReminderPickerVisibility(false)}
                />
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={saveMeeting}>
                    <Text style={styles.buttonText}>Speichern</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={deleteMeeting}>
                    <Text style={styles.buttonText}>Löschen</Text>
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
