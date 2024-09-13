import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Link, useLocalSearchParams } from 'expo-router';


const Todos = () => {
    const { date } = useLocalSearchParams();
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [todos, setTodos] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        if (date) {
            setSelectedDate(date as string);
        }
    }, [date]);

    useEffect(() => {
        const loadTodos = async () => {
            try {
                const storedTodos = await AsyncStorage.getItem('todos');
                if (storedTodos) {
                    setTodos(JSON.parse(storedTodos));
                }
            } catch (error) {
                console.error('Error loading todos:', error);
            }
        };

        const unsubscribe = navigation.addListener('focus', loadTodos);
        return unsubscribe;
    }, [navigation]);

    const renderItem = ({ item }) => (
        <View style={styles.todoItem}>
            <Text style={styles.todoText}>{item.title}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>{selectedDate}</Text>
            <FlatList
                data={todos}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
            />
            <View style={styles.addButton}>
                <View>
                    <Link href='/todo' style={styles.buttonText}>+</Link>
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
    todoItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    todoText: {
        fontSize: 18,
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
    addButtonText: {
        fontSize: 30,
        color: 'white',
    },
    buttonText: {
        fontSize: 25
    }
});

export default Todos;