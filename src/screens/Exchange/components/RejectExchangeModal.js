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
import colors from '../../../constants/color';
import { rejectExchange } from '../../../service/ExchangeService';

const RejectExchangeModal = ({ idExchange, visible, onClose, onConfirm, navigation }) => {
    const [note, setNote] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [noteError, setNoteError] = useState('');

    const handleConfirm = async () => {
        let hasError = false;

        if (!note) {
            setNoteError('La raison du refus est requise.');
            hasError = true;
        } else {
            setNoteError('');
        }

        if (!hasError) {
            setLoading(true);
            setErrorMessage('');
            try {
                const body = {
                    note,
                };
                await rejectExchange(idExchange, body, navigation);
                onConfirm();
            } catch (error) {
                setErrorMessage(error.message);
            } finally {
                setLoading(false);
            }
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
                    <Text style={styles.title}>Refuser l'échange</Text>

                    <Text style={styles.label}>Pourquoi refuseriez-vous cette offre ?</Text>
                    <TextInput
                        style={[styles.textarea, noteError && styles.borderError]}
                        value={note}
                        onChangeText={text => {
                            setNote(text);
                            setNoteError('');
                        }}
                        multiline
                        numberOfLines={4}
                    />
                    {noteError ? (
                        <Text style={styles.error}>{noteError}</Text>
                    ) : null}

                    {errorMessage ? (
                        <Text style={styles.errorMessage}>{errorMessage}</Text>
                    ) : null}

                    <View style={styles.buttonContainer}>
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
                        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                            <Image
                                source={require('../../../assets/icons/Close.png')}
                                style={styles.buttonIcon}
                            />
                            <Text style={styles.buttonText}>Annuler</Text>
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
    textarea: {
        height: 100,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingTop: 10,
        marginBottom: 20,
        justifyContent: 'center',
        color: colors.textPrimary,
        textAlignVertical: 'top',
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
    errorMessage: {
        color: colors.error,
        fontSize: 16,
        marginBottom: 10,
        textAlign: 'center',
        fontFamily: 'Asul-Bold',
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

export default RejectExchangeModal;
