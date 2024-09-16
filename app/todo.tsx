import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useLocalSearchParams } from 'expo-router';

interface Todo {
    id: string;
    title: string;
    description: string;
}

const Todo = () => {
    const { selectedDate, todoId } = useLocalSearchParams<{ selectedDate: string, todoId: string }>();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const navigation = useNavigation();
    const [todoListName, setTodoListName] = useState<string | null>(null);

    useEffect(() => {
        if (selectedDate) {
            setTodoListName(selectedDate as string);
        }

        const loadTodo = async () => {
            if (selectedDate && todoId) {
                try {
                    const todos = await AsyncStorage.getItem(selectedDate);
                    if (todos) {
                        const todosArray: Todo[] = JSON.parse(todos);
                        const todo = todosArray.find(t => t.id === todoId);
                        if (todo) {
                            setTitle(todo.title);
                            setDescription(todo.description);
                        }
                    }
                } catch (error) {
                    Alert.alert('Error', 'Fehler beim laden des Todos');
                }
            }
        };

        loadTodo();
    }, [selectedDate, todoId]);

    const saveTodo = async () => {
        if (title === '' || description === '') {
            Alert.alert('Error', 'Bitte füllen Sie alle Felder aus');
            return;
        }
        try {
            const todo: Todo = { id: todoId || Date.now().toString(), title, description };
            if (todoListName) {
                const existingTodos = await AsyncStorage.getItem(todoListName);
                const todos: Todo[] = existingTodos ? JSON.parse(existingTodos) : [];

                const index = todos.findIndex(t => t.id === todo.id);
                if (index !== -1) {
                    todos[index] = todo;
                } else {
                    todos.push(todo);
                }

                await AsyncStorage.setItem(todoListName, JSON.stringify(todos));
                Alert.alert('Gespeichert', 'To-do erfolgreich gespeichert');
            }
            setTitle('');
            setDescription('');
            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', 'Fehler beim Speichern vom To-do');
        }
    };

    const deleteTodo = async () => {
        try {
            if (todoListName && todoId) {
                const existingTodos = await AsyncStorage.getItem(todoListName);
                if (existingTodos) {
                    const todos: Todo[] = JSON.parse(existingTodos);
                    const updatedTodos = todos.filter(t => t.id !== todoId);
                    await AsyncStorage.setItem(todoListName, JSON.stringify(updatedTodos));
                    Alert.alert('Gelöscht', 'To-do erfolgreich gelöscht');
                    navigation.goBack();
                }
            }
        } catch (error) {
            Alert.alert('Error', 'Fehler beim Löschen vom To-do');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>{selectedDate}</Text>
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Titel:</Text>
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
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={deleteTodo}>
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