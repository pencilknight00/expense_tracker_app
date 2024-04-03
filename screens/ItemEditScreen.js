import React, { useState } from 'react';
import { StyleSheet, View, Text, useWindowDimensions, Platform, Pressable, TextInput, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'

import Ionicons from '@expo/vector-icons/Ionicons'
import {Feather} from '@expo/vector-icons'


const ItemEditScreen = ({ navigation, route }) => {
    const { expense, index} = route.params;
    const styles = useStyle();
    const [amount, setAmount] = useState(expense.amount.toString());
    const [title, setTitle] = useState(expense.title);
    const [description, setDescription] = useState(expense.description);
    const [error, setError] = useState('');

    const saveExpense = async () => {
        try {
            if (!amount) {
                setError('Amount is required');
                return;
            }

            const newAmount = parseFloat(amount);
            if (isNaN(newAmount)) {
                // Display an error message or handle invalid amount here
                console.error('Invalid amount entered');
                return;
            }

            const updatedExpense = {
                ...expense,
                amount: newAmount,
                title: title.trim(),
                description: description.trim()
            
            };

            // Fetch existing expenses from AsyncStorage
            const jsonExpenses = await AsyncStorage.getItem('expenses');
            let expenses = [];
            if (jsonExpenses !== null) {
                expenses = JSON.parse(jsonExpenses);
            }
            // Update the expense in the array
            expenses[index] = updatedExpense;
            // Save updated expenses back to AsyncStorage
            await AsyncStorage.setItem('expenses', JSON.stringify(expenses));
            // Navigate back to HomeScreen
            navigation.navigate('HomeScreen');
        } catch (error) {
            console.error('Error saving expense:', error);
        }
    };

    return (

        <ScrollView style={{flex: 1, backgroundColor: '#fff'}}>

        <View style={styles.container}>
            <View style={styles.header}>
                <Pressable onPress={ () => navigation.navigate("HomeScreen")}>
                    <Ionicons name='chevron-back' size={30} color="black"/>
                </Pressable>
                <Text style={styles.headerText}>Edit Expense</Text>
            </View>
            <View style={styles.ExpenseValueContainer}>
                <Text style={{color: 'gray', fontSize: 18, fontWeight: '800', marginLeft: 30, marginBottom: 10}}>Amount</Text>
                <View style={styles.ExpenseValue}>
                    <View>
                        <Text style={{fontSize: 30, fontWeight: '600', marginRight: 10}}>$</Text>
                    </View>
                    <View style={styles.amountContainer}>
                        <TextInput
                            style={{fontSize: 40, fontWeight: '800'}}
                            placeholder='0'
                            keyboardType='numeric'
                            value={amount}
                            onChangeText={(text) => setAmount(text)}
                        />
                    </View>
                    <View style={{flex: 1, paddingRight: 30}}>
                        <Text style={{fontSize: 20, fontWeight: '800', alignSelf: 'flex-end', color: 'gray'}}>USD</Text>
                    </View>
                </View>
                <View style={styles.line}></View>
            </View>

            <View style={styles.expenseDetailContainer}>
                <View>
                    <Text style={{color: 'gray', fontSize: 18, fontWeight: '800', marginLeft: 30, marginBottom: 10}}>Expenses made for</Text>
                    <TextInput
                        style={styles.expenseText}
                        placeholder='Title'
                        value={title}
                        onChangeText={(text) => setTitle(text)}
                    />
                </View>
                <View>
                    <Text style={{color: 'gray', fontSize: 18, fontWeight: '800', marginLeft: 30, marginBottom: 10}}>Expenses made for</Text>
                    <TextInput
                        style={styles.expenseText}
                        placeholder='Description written here'
                        value={description}
                        onChangeText={(text) => setDescription(text)}
                    />
                </View>
            </View>
            <View style={styles.numpadContainer}>
                <View>
                <Pressable style={[styles.addBtn, !amount && styles.disabledBtn]} onPress={saveExpense} disabled={!amount}>
                        <Feather name="check-circle" size={35} color="white" />
                    </Pressable>
                </View>
            </View>
        </View>
        </ScrollView>
    );
};

function useStyle(){
    const windowWidth = useWindowDimensions().width
    return StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        paddingTop: (Platform.OS === 'ios') ? (windowWidth > 600 ? 30: 50) : 40,
        marginBottom: 100
    },
    header:{
        width: "85%",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    headerText:{
        marginLeft: 20,
        fontSize: 24,
        fontWeight: '800'
    },
    amountContainer:{
        flex: 4,

    },
    ExpenseValueContainer:{
        marginTop: 30,
        width: '90%',
        
    },
    ExpenseValue:{
        height: 80,
        flexDirection: 'row',
        alignItems:  (Platform.OS === 'ios') ? 'baseline' : 'center',
        marginLeft: 30
    },
    line:{
        width: '100%',
        height: 3,
        backgroundColor: 'black',
        alignSelf: 'center'
    },
    expenseDetailContainer:{
        height: 200,
        width: '90%',
        paddingTop: 20
    },
    expenseText:{
        fontWeight: 'bold',
            fontSize: 20,
            marginLeft: 30, 
            marginBottom: 30
    },
    addBtn:{
        width: 70,
        height: 70,
        backgroundColor: '#7E0CF5',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 35,
        shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 6,
                },
                shadowOpacity: 0.27,
                shadowRadius: 4.65,
                elevation: 7,
                zIndex:999,
     },
     disabledBtn:{
        width: 70,
        height: 70,
        backgroundColor: 'gray',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 35,
        shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 6,
                },
                shadowOpacity: 0.27,
                shadowRadius: 4.65,
                elevation: 7,
                zIndex:999,
     }

})
}
export default ItemEditScreen;