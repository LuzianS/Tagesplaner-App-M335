import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link, useLocalSearchParams } from 'expo-router';

const Meetings = () => {
    const { date } = useLocalSearchParams();
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [meetings, setMeetings] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        if (date) {
            setSelectedDate(date as string);
        }
    }, [date]);

    useEffect(() => {
        const loadMeetings = async () => {
            try {
                const storedMeetings = await AsyncStorage.getItem('meetings');
                if (storedMeetings) {
                    setMeetings(JSON.parse(storedMeetings));
                }
            } catch (error) {
                Alert.alert('Error', 'Fehler beim laden der Meetings');
            }
        };

        loadMeetings();
    }, []);

    const renderItem = ({ item }) => (
        <View style={styles.meetingItem}>
            <Text>{item.timeStart} - {item.timeEnd} ({item.duration})</Text>
            <Text>{item.title}</Text>
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
                <View>
                    <Link href='/meeting' style={styles.buttonText}>+</Link>
                </View>
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