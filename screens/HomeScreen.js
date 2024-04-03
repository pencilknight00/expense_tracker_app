import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, Text, useWindowDimensions, Pressable, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'
import Feather from '@expo/vector-icons/Feather'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'

{/* <Feather name='coffee' color="white" size={30}/> */}

{/* <Feather name='dollar-sign' color="white" size={30}/> */}
{/* <Ionicons  name='fast-food-outline' color="white" size={30}/>
<Feather name='shopping-bag' color="white" size={30}/>
<Ionicons name='heart-circle-outline' color="white" size={30}/>
<Feather name='book' color="white" size={30}/>
<Feather name='smile' color="white" size={30}/>
<MaterialIcons name='emoji-transportation' color="white" size={30}/> */}
const HomeScreen = ({ navigation }) => {
    const styles = useStyle();
    const [totalExpenses, setTotalExpenses] = useState(0);

    const [expenses, setExpenses] = useState([]);

    useEffect(() => {
        // Load expenses from AsyncStorage when the component mounts
        loadExpenses();
    }, []);
    useEffect(() => {
        // Refresh expenses whenever the screen focus changes
        const unsubscribe = navigation.addListener('focus', () => {
            loadExpenses();
        });

        return unsubscribe;
    }, [navigation]);
    const loadExpenses = async () => {
        try {
            const jsonExpenses = await AsyncStorage.getItem('expenses');
            if (jsonExpenses !== null) {
                const parsedExpenses = JSON.parse(jsonExpenses);
                setExpenses(parsedExpenses);
                const total = parsedExpenses.reduce((acc, expense) => acc + expense.amount, 0);
                setTotalExpenses(total);
            }
            console.log(jsonExpenses)
        } catch (error) {
            console.error('Error loading expenses:', error);
        }
    };

    const saveExpenses = async (updatedExpenses) => {
        try {
            await AsyncStorage.setItem('expenses', JSON.stringify(updatedExpenses));
            setExpenses(updatedExpenses);
        } catch (error) {
            console.error('Error saving expenses:', error);
        }
    };
    const clearExpenses = async () => {
        try {
            await AsyncStorage.removeItem('expenses');
            setExpenses([]);
        } catch (error) {
            console.error('Error clearing expenses:', error);
        }
    };

    const processMoney = (amount) => {
        if (amount >= 1000000) {
            return (amount / 1000000).toFixed(1) + 'M';
        } else if (amount >= 1000) {
            return (amount / 1000).toFixed(1) + 'K';
        } else {
            return amount.toString();
        }
    };
    const renderExpenses = () => {
        const reversedExpenses = [...expenses].reverse();
        return reversedExpenses.map((expense, index) => (
            <Pressable key={index} style={styles.expenseContainer} onPress={() => navigation.navigate("ItemEditScreen", { expense, index: expenses.length - index - 1, saveExpenses })}>
            <View style={styles.expenseIconContainer}>
                    {expense.title === 'Coffee' ? (<Feather name='coffee' color="white" size={30}/>) : 
                    (expense.title === 'Food' ? (<Ionicons  name='fast-food-outline' color="white" size={30}/>)  :
                    (expense.title === 'Shopping' ? (<Feather name='shopping-bag' color="white" size={30}/>) :
                    (expense.title === 'Health' ? (<Ionicons name='heart-circle-outline' color="white" size={30}/>) :
                    (expense.title === 'Study' ? (<Feather name='book' color="white" size={30}/>) : 
                    (expense.title === 'Entertaining' ? (<Feather name='smile' color="white" size={30}/>) :
                    (expense.title === 'Transportation' ? (<MaterialIcons name='emoji-transportation' color="white" size={30}/>) : 
                    (<Feather name='dollar-sign' color="white" size={30}/>)))))))}
                </View>
                <View style={styles.expenseTitleAndDes}>
                    <Text style={styles.expenseTitle}>{expense.title}</Text>
                    <Text style={styles.expenseDescription}>{expense.description}</Text>
                </View>
                <View style={styles.expenseMoney}>
                    <Text style={{fontWeight: '900', fontSize: 14 }}>${processMoney(expense.amount)}</Text>
                </View>
            </Pressable>
        ));
    };
   

    return (
        <View>
            <ScrollView>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.headerText}>Welcome</Text>
                        <View style={styles.userIconContainer}>
                            <View style={styles.userIcon}>
                                <Feather name='user' color="white" size={30}></Feather>
                            </View>
                        </View>
                    </View>
                    <View style={styles.shadow}>
                        <View style={styles.balanceContainer}>
                            <View>
                                <Text style={styles.text}>$</Text>
                            </View>
                            <View style={styles.money}>
                                <Text style={[styles.text, { fontSize: 40}]}>{totalExpenses}</Text>
                            </View>
                            <View style={[styles.currency]}>
                                <Text style={[styles.text, { fontSize: 25}]}>USD</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.allExpensesContainer}>
                        <Text style={{fontWeight: '900', fontSize: 18, marginBottom: 20}}>All Expenses</Text>
                        {renderExpenses()}
                    </View>
                </View>
            </ScrollView>
            <Pressable style={styles.addExpenseBtn} onPress={() => navigation.navigate('NewExpenseScreen')}>
                <Feather name='plus' color="white" size={30}/>
            </Pressable>
        </View>
    );
};


function useStyle(){
    const windowWidth = useWindowDimensions().width;
    const windowHeight = useWindowDimensions().height;
    return  StyleSheet.create({
        container:{
            minHeight: windowHeight,
            paddingTop: (Platform.OS === 'ios') ? (windowWidth > 600 ? null: 50) : 40,
            flex: 1,
            backgroundColor: '#fff',
            alignItems: 'center',
        },
        header:{
            height: 100,
            width: '85%',
            flexDirection: 'row',
            alignItems: 'center'
            
        },
        headerText:{
            color: 'black',
            fontWeight: '800',
            fontSize: 25       
        },
        userIconContainer:{
            flex: 1
        },
        userIcon:{
            backgroundColor: '#7E0CF5',
            height: 50,
            width: 50,
            borderRadius: 20,
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'flex-end'
        },
        shadow:{
            width: '85%',
            // shadowColor: "#000",
            // shadowOffset: {
            //     width: 6,
            //     height: 6,
            // },
            // shadowOpacity: 0.27,
            // shadowRadius: 4.65,
            // elevation: 10,
            // zIndex:999, 
            
        },
        balanceContainer:{
            
            flexDirection: 'row',
            width: '100%',
            backgroundColor: 'black',
            height: 150,
            borderRadius: 50,
            alignItems: 'baseline',
            padding: 20,
            paddingTop: 35,
            alignSelf: 'center',
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 6,
            },
            shadowOpacity: 0.27,
            shadowRadius: 4.65,
            elevation: 20,
            zIndex:999,
        },
        text:{
            color: 'white',
            fontWeight: 'bold',
            fontSize: 30
        },
        money:{
            margin: 10,
         },
        currency:{
            flex: 1,
            alignItems: 'flex-end'
        },
        allExpensesContainer:{
            width: '85%',
            paddingTop: 50,
        },
        expenseContainer:{
            flexDirection: 'row',
            backgroundColor: '#F3F3F3',
            padding: 10,
            borderRadius: 25,
            marginVertical: 5,
            alignItems: 'center',
        },
        expenseIconContainer:{
            backgroundColor: '#7E0CF5',
            height: 65,
            width: 65,
            borderRadius: 25,
            alignItems: 'center',
            justifyContent: 'center'
    
        },
        expenseTitle:{
            fontWeight: 'bold',
            fontSize: 20
        },
        expenseDescription:{
            color: 'gray',
            fontWeight: 'bold'
        },
        expenseTitleAndDes:{
            marginLeft: 20,
            width: windowWidth > 600 ? null : 140
        },
        expenseMoney:{
            flex: 1,
            alignItems: 'flex-end',
            padding: 10
        },
        expenseMoneyText:{
    
        },
        addExpenseBtn:{
            position: 'sticky',
            width: 60,
            height: 60,
            backgroundColor: 'black',
            borderRadius: 30,
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'flex-end',
            right: 20,
            bottom: windowWidth > 600 ? 110 : 130,
            shadowColor: "#000",
            shadowOffset: {
                width: 6,
                height: 6,
            },
            shadowOpacity: 0.27,
            shadowRadius: 4.65,
            elevation: 20,
            zIndex:999,
        }
    
    })
    
}


export default HomeScreen;