import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors } from '../theme';
import { AppContext } from '../context/AppContext';

const { width } = Dimensions.get('window');

const CustomAlert = () => {
  const { alertConfig, hideAlert } = useContext(AppContext);

  if (!alertConfig || !alertConfig.visible) return null;

  const { title, message, type = 'success', buttons = [] } = alertConfig;

  // Determine icon and color based on type
  let iconName = 'checkmark-circle';
  let iconColor = '#10B981'; // Colors.success
  let accentBg = 'rgba(16, 185, 129, 0.1)';

  if (type === 'error') {
    iconName = 'alert-circle';
    iconColor = '#EF4444';
    accentBg = 'rgba(239, 68, 68, 0.1)';
  } else if (type === 'warning') {
    iconName = 'warning';
    iconColor = '#F59E0B';
    accentBg = 'rgba(245, 158, 11, 0.1)';
  } else if (type === 'confirm' || type === 'info') {
    iconName = 'help-circle';
    iconColor = Colors.primary;
    accentBg = 'rgba(39, 174, 96, 0.1)';
  }

  const handleButtonPress = (onPressCallback) => {
    hideAlert();
    if (onPressCallback) {
      setTimeout(() => {
        onPressCallback();
      }, 150); // Allow modal to close first
    }
  };

  const isVertical = buttons.length > 2;

  return (
    <Modal
      transparent
      visible={alertConfig.visible}
      animationType="fade"
      onRequestClose={hideAlert}
    >
      <View style={styles.overlay}>
        <View style={styles.alertCard}>
          {/* Top Decorative Icon */}
          <View style={[styles.iconContainer, { backgroundColor: accentBg }]}>
            <Ionicons name={iconName} size={36} color={iconColor} />
          </View>

          {/* Title & Message */}
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          {/* Action Buttons */}
          <View style={[styles.buttonContainer, { flexDirection: isVertical ? 'column' : 'row' }]}>
            {buttons.length === 0 ? (
              <TouchableOpacity
                style={[styles.btn, styles.btnPrimary]}
                onPress={() => handleButtonPress()}
              >
                <Text style={styles.btnTextPrimary}>OK</Text>
              </TouchableOpacity>
            ) : (
              buttons.map((btn, index) => {
                const isPrimary = btn.style !== 'cancel' && (index === buttons.length - 1 || buttons.length === 1);
                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.btn,
                      isPrimary ? styles.btnPrimary : styles.btnSecondary,
                      isVertical && styles.btnVertical,
                    ]}
                    onPress={() => handleButtonPress(btn.onPress)}
                  >
                    <Text
                      style={[
                        isPrimary ? styles.btnTextPrimary : styles.btnTextSecondary,
                      ]}
                    >
                      {btn.text}
                    </Text>
                  </TouchableOpacity>
                );
              })
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  alertCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 24,
    width: '100%',
    maxWidth: width - 60,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 10,
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1C20',
    textAlign: 'center',
    marginBottom: 10,
  },
  message: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  buttonContainer: {
    width: '100%',
  },
  btn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 6,
  },
  btnVertical: {
    flex: 0,
    width: '100%',
    marginVertical: 4,
    marginHorizontal: 0,
  },
  btnPrimary: {
    backgroundColor: Colors.primary,
  },
  btnSecondary: {
    backgroundColor: '#F3F4F6',
  },
  btnTextPrimary: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  btnTextSecondary: {
    color: '#4B5563',
    fontWeight: '700',
    fontSize: 14,
  },
});

export default CustomAlert;
