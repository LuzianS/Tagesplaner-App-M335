import { useState } from 'react';
import { Modal, View, StyleSheet, Text, Button } from 'react-native';
import DatePicker from 'react-native-modern-datepicker';
import { getFormatedDate } from 'react-native-modern-datepicker';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const today = new Date();
  const startDate = getFormatedDate(today, 'YYYY/MM/DD');
  const [date, setDate] = useState(startDate);
  const navigation = useNavigation();

  const handleChange = (selectedDate) => {
    setDate(selectedDate);
    console.log("Switched date");
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleBackground}>
        <Text style={styles.title}>Tagesplaner</Text>
      </View>
      <Modal
        transparent={false}
        visible={false}
        style={styles.modalContainer}
      >
        <View style={styles.modalContent}>
          <DatePicker
            mode='calendar'
            minimumDate={startDate}
            selected={date}
            onDateChange={handleChange}
          />
        </View>
      </Modal>
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
          <Button title="Meetings" onPress={() => console.log("testing")} />
        </View>
        <View style={styles.button}>
          <Button title="To-do-Liste" onPress={() => navigation.navigate('Home')} />
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
  title: {
    fontSize: 40,
    marginTop: 40,
    marginLeft: 5
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    marginTop: 90,
  },
  selectedDate: {
    fontSize: 25,
    marginTop: 390,
    marginLeft: 5,
  },
  boxContainer: {
    marginTop: 20,
    marginLeft: 5,
  },
  box: {
    borderColor: 'black',
    borderWidth: 2,
    padding: 15,
    marginVertical: 5,
    marginRight: 5,
    borderRadius: 25
  },
  boxText: {
    color: 'black',
    fontSize: 20,
  },
  titleBackground: {
    backgroundColor: '#3848c2',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  button: {
    borderColor: 'black',
    borderWidth: 2,
    padding: 15,
    marginVertical: 5,
    marginRight: 5,
    borderRadius: 25,
    backgroundColor: '#55D7F9',
  }
});