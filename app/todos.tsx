import { Link, useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";
import { useEffect, useState } from "react";

export default function Todos() {
    const { date } = useLocalSearchParams();
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    useEffect(() => {
        if (date) {
            setSelectedDate(date as string);
        }
    }, [date]);

    return (
        <View>
            <Text>Datum: {selectedDate}</Text>
            <Link href='/todo'>Todo</Link>
        </View>
    );
}
