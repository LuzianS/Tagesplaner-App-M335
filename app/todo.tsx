import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Link, useLocalSearchParams } from 'expo-router';
import { processColorsInProps } from 'react-native-reanimated/lib/typescript/reanimated2/Colors';

const Todo = () => {
    const { selectedDate } = useLocalSearchParams();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const navigation = useNavigation();
    const [todoListName, settodoListName] = useState<string | null>(null);

    useEffect(() => {
        if (selectedDate) {
            settodoListName(selectedDate as string);
        }
    }, [selectedDate]);


    const saveTodo = async () => {
        if (title === '' || description === '') {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }
        try {
            const todo = { id: Date.now().toString(), title, description, completed: false };
            if (todoListName) {
                const existingTodos = await AsyncStorage.getItem(todoListName);
                const todos = existingTodos ? JSON.parse(existingTodos) : [];
                todos.push(todo);
                await AsyncStorage.setItem(todoListName, JSON.stringify(todos));
                Alert.alert('Gespeichert', 'To-do erfolgreich gespeichert');
            }
            setTitle('');
            setDescription('');
        } catch (error) {
            Alert.alert('Error', 'Fehler beim Speichern vom To-do');
        }
    };
    return (
        <View style={styles.container}>
            <Text style={styles.header}>{selectedDate}</Text>
            <View style={styles.inputGroup}>
                <Text style={styles.label}>To-do:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Titel"
                    value={title}
                    onChangeText={setTitle}
                />
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
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={saveTodo}>
                    <Text style={styles.buttonText}>Speichern</Text>
                    <View>
                        <Link href='/todos' style={styles.buttonText}>
                        </Link>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={() => Alert.alert('Gelöscht')}>
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
export default Todo;