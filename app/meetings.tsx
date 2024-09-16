import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Link, useLocalSearchParams } from 'expo-router';

interface Meeting {
    id: string;
    timeStart: string;
    timeEnd: string;
    title: string;
    description?: string;
    reminder?: string;
}

const Meetings = () => {
    const { date } = useLocalSearchParams();
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [meetings, setMeetings] = useState<Meeting[]>([]);
    const navigation = useNavigation();

    useEffect(() => {
        if (date) {
            setSelectedDate(date as string);
        }
    }, [date]);

    useEffect(() => {
        const loadMeetings = async () => {
            try {
                if (selectedDate) {
                    const storedMeetings = await AsyncStorage.getItem(selectedDate + "/meetings");
                    if (storedMeetings) {
                        const parsedMeetings = JSON.parse(storedMeetings);
                        const sortedMeetings = parsedMeetings.sort((a: Meeting, b: Meeting) =>
                            new Date(a.timeStart).getTime() - new Date(b.timeStart).getTime()
                        );
                        setMeetings(sortedMeetings);
                    } else {
                        setMeetings([]);
                    }
                }
            } catch (error) {
                Alert.alert('Error', 'Fehler beim Laden der Meetings');
            }
        };

        loadMeetings();

        const unsubscribe = navigation.addListener('focus', loadMeetings);
        return unsubscribe;
    }, [selectedDate, navigation]);

    const formatTime = (isoDate: string) => {
        const date = new Date(isoDate);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const calculateDuration = (start: string, end: string) => {
        const startTime = new Date(start);
        const endTime = new Date(end);
        const durationMs = endTime.getTime() - startTime.getTime();
        const minutes = Math.floor(durationMs / 1000 / 60);
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return `${hours}h ${remainingMinutes}m`;
    };

    const renderItem = ({ item }: { item: Meeting }) => (
        <View style={styles.meetingItem}>
            <Link href={`/meeting?selectedDate=${selectedDate}&meetingId=${item.id}`}>
                <View style={{ flexDirection: 'column' }}>
                    <Text style={{ fontWeight: 'bold' }}>
                        {formatTime(item.timeStart)} - {formatTime(item.timeEnd)}, {calculateDuration(item.timeStart, item.timeEnd)}
                    </Text>
                    <Text>{item.title}</Text>
                </View>
            </Link>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>{selectedDate}</Text>

            <FlatList
                data={meetings}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
            />

            <View style={styles.addButton}>
                <Link href={`/meeting?selectedDate=${selectedDate}`} style={styles.buttonText}>+</Link>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: 'white',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    meetingItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    addButton: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        backgroundColor: '#55D7F9',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: 'black',
        borderWidth: 2
    },
    buttonText: {
        fontSize: 30,
        color: 'black',
    },
});

export default Meetings;
