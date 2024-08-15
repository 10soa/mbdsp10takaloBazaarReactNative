/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Modal,
    StyleSheet,
    Image,
    ActivityIndicator,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import colors from '../../../constants/color';
import { accepterExchange } from '../../../service/ExchangeService';

const AcceptExchangeModal = ({ idExchange, visible, onClose, onConfirm, navigation }) => {
    const [meetingPlace, setMeetingPlace] = useState('');
    const [appointmentDate, setAppointmentDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [loading, setLoading] = useState(false);

    const [meetingPlaceError, setMeetingPlaceError] = useState('');
    const [appointmentDateError, setAppointmentDateError] = useState('');

    const formatDisplayDate = (date) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        const datePart = date.toLocaleDateString('fr-FR', options);
        const timePart = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        return `${datePart} ${timePart}`;
    };

    const formatValueDate = (date) => {
        const pad = (n) => (n < 10 ? `0${n}` : n);
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    };

    const handleConfirm = async () => {
        let hasError = false;

        if (!meetingPlace) {
            setMeetingPlaceError('Le lieu de rendez-vous est requis.');
            hasError = true;
        } else {
            setMeetingPlaceError('');
        }

        if (!appointmentDate) {
            setAppointmentDateError('La date de rendez-vous est requise.');
            hasError = true;
        } else {
            setAppointmentDateError('');
        }

        if (!hasError) {
            setLoading(true);
            try {
                const formattedDate = formatValueDate(appointmentDate);
                const body = {
                    meeting_place: meetingPlace,
                    appointment_date: formattedDate,
                };
                await accepterExchange(idExchange, body, navigation);
                onConfirm();
            } catch (error) {
                console.error('Failed to accept exchange:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    const onDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setAppointmentDate(selectedDate);
            setAppointmentDateError('');
            setShowTimePicker(true);
        }
    };

    const onTimeChange = (event, selectedTime) => {
        setShowTimePicker(false);
        if (selectedTime) {
            const newDate = new Date(appointmentDate);
            newDate.setHours(selectedTime.getHours());
            newDate.setMinutes(selectedTime.getMinutes());
            setAppointmentDate(newDate);
            setAppointmentDateError('');
        }
    };

    return (
        <Modal
            transparent={true}
            visible={visible}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                    <Text style={styles.title}>Accepter l'échange</Text>

                    <Text style={styles.label}>Lieu de rendez-vous</Text>
                    <TextInput
                        style={[styles.input, meetingPlaceError && styles.borderError]}
                        value={meetingPlace}
                        onChangeText={text => {
                            setMeetingPlace(text);
                            setMeetingPlaceError('');
                        }}
                    />
                    {meetingPlaceError ? (
                        <Text style={styles.error}>{meetingPlaceError}</Text>
                    ) : null}

                    <Text style={styles.label}>Date de rendez-vous</Text>
                    <TouchableOpacity
                        style={[styles.input, appointmentDateError && styles.borderError]}
                        onPress={() => setShowDatePicker(true)}
                    >
                        <Text style={[styles.dateText, appointmentDateError && styles.error]}>
                            {formatDisplayDate(appointmentDate)}
                        </Text>
                    </TouchableOpacity>
                    {appointmentDateError ? (
                        <Text style={styles.error}>{appointmentDateError}</Text>
                    ) : null}

                    {showDatePicker && (
                        <DateTimePicker
                            value={appointmentDate}
                            mode="date"
                            display="default"
                            onChange={onDateChange}
                        />
                    )}

                    {showTimePicker && (
                        <DateTimePicker
                            value={appointmentDate}
                            mode="time"
                            display="default"
                            onChange={onTimeChange}
                        />
                    )}

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                            <Image
                                source={require('../../../assets/icons/Close.png')}
                                style={styles.buttonIcon}
                            />
                            <Text style={styles.buttonText}>Annuler</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.confirmButton}
                            onPress={handleConfirm}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <>
                                    <Image
                                        source={require('../../../assets/icons/Done.png')}
                                        style={styles.buttonIcon}
                                    />
                                    <Text style={styles.buttonText}>Confirmer</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: '90%',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        elevation: 10,
    },
    title: {
        fontSize: 20,
        fontFamily: 'Asul-Bold',
        color: colors.textPrimary,
        marginBottom: 20,
        textAlign: 'center',
    },
    label: {
        fontSize: 16,
        fontFamily: 'Asul',
        color: colors.textPrimary,
        marginBottom: 10,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 20,
        justifyContent: 'center',
        color: colors.textPrimary,
    },
    dateText: {
        color: colors.textPrimary,
    },
    borderError: {
        borderColor: colors.error,
    },
    error: {
        color: colors.error,
        fontSize: 14,
        marginBottom: 10,
        marginTop: -15,
        fontFamily: 'Asul',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cancelButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.textPrimary,
        padding: 10,
        borderRadius: 5,
    },
    confirmButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.primary,
        padding: 10,
        borderRadius: 5,
    },
    buttonIcon: {
        width: 20,
        height: 20,
        tintColor: '#fff',
        marginRight: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Asul-Bold',
    },
});

export default AcceptExchangeModal;
