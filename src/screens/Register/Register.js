import React, {useState, useMemo, useEffect} from 'react';
import {
  KeyboardAvoidingView,
  View,
  ScrollView,
  Image,
  StyleSheet,
} from 'react-native';
import MainBtn from '../../components/MainBtn';
import TextField from '../../components/TextField';
import {useTheme} from '../../providers/StyleProvider';
import {WidthContainer, Divider} from '../../styles/styleComponents';
import {useHeaderHeight} from '@react-navigation/stack';
import {assets, MAX_HEIGHT, logger} from '../../utils';
import {register} from '../../api/auth';
import {useAuth} from '../../providers/AuthProvider';
import ImagePicker from 'react-native-image-crop-picker';
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';
import {checkErrors} from './registerHelpers';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function Register() {
  const {colors, rootStyles} = useTheme();
  const [errors, setErrors] = useState({});
  const {setCurrentUser} = useAuth();
  const [phone, setPhone] = useState('');
  const [img, setImg] = useState('');
  const [password, setPassword] = useState('');
  const [repeatedPassword, setRepeatedPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  const fields = useMemo(
    () => [
      {
        label: 'first name',
        onChangeText: setFirstName,
        error: errors?.firstName,
      },
      {label: 'last name', onChangeText: setLastName, error: errors?.lastName},
      {
        label: 'phone',
        onChangeText: setPhone,
        error: errors?.phone,
        keyboardType: 'phone-pad',
      },
      {
        label: 'email',
        onChangeText: setEmail,
        error: errors?.email,
        keyboardType: 'email-address',
      },
      {
        label: 'password',
        onChangeText: setPassword,
        error: errors?.password,
        secureTextEntry: true,
      },
      {
        label: 'repeat password',
        onChangeText: setRepeatedPassword,
        error: errors?.repeatedPassword,
        secureTextEntry: true,
      },
    ],
    [errors],
  );

  useEffect(() => {
    if (Object.values(errors).length)
      checkErrors(
        setErrors,
        phone,
        password,
        repeatedPassword,
        email,
        firstName,
        lastName,
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phone, password, repeatedPassword, email, firstName, lastName]);

  const registerNewUser = async () => {
    if (
      checkErrors(
        setErrors,
        phone,
        password,
        repeatedPassword,
        email,
        firstName,
        lastName,
      )
    )
      return;

    const payload = {
      phone,
      password,
      avatar: img,
      email,
      firstName,
      lastName,
    };
    if (!img) delete payload.avatar;
    const user = await register(payload);
    if (user) setCurrentUser(user);
  };

  return (
    <KeyboardAvoidingView
      behavior="height"
      keyboardVerticalOffset={useHeaderHeight()}
      enabled
      style={[rootStyles.bg(colors), rootStyles.flex1]}>
      <ScrollView
        bounces={false}
        contentContainerStyle={[
          rootStyles.spaceBetween,
          {minHeight: MAX_HEIGHT - 125 - useHeaderHeight()},
        ]}>
        <View>
          <View>
            <Pressable
              onPress={() =>
                ImagePicker?.openPicker({
                  width: 300,
                  height: 300,
                  cropping: true,
                  includeBase64: true,
                  cropperCircleOverlay: true,
                })
                  .then(image => {
                    setImg(`data:${image.mime};base64,${image.data}`);
                  })
                  .catch(({message}) => logger.warn(message))
              }>
              <Image
                source={img ? {uri: img} : assets.profilePlaceholder}
                style={styles.profilePlaceholder}
              />
            </Pressable>
            {img ? (
              <Icon
                name="highlight-remove"
                size={35}
                color={colors.font}
                style={styles.removeImg}
                onPress={() => setImg('')}
              />
            ) : null}
          </View>
          <Divider m={20} />
          {fields.map(
            ({
              label,
              onChangeText,
              error,
              secureTextEntry = false,
              keyboardType = null,
            }) => (
              <View key={label}>
                <Divider m={15} />
                <WidthContainer>
                  <TextField
                    label={label}
                    onChangeText={onChangeText}
                    error={error}
                    secureTextEntry={secureTextEntry}
                    keyboardType={keyboardType}
                  />
                </WidthContainer>
              </View>
            ),
          )}
        </View>
        <View style={rootStyles.mb5}>
          <MainBtn onPress={registerNewUser}>Register</MainBtn>
          <View
            style={[
              rootStyles.flexRow,
              rootStyles.alignSelfCenter,
              rootStyles.mt5,
            ]}></View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  profilePlaceholder: {
    alignSelf: 'center',
    width: 150,
    height: 150,
    marginTop: 10,
    borderRadius: 150,
  },
  removeImg: {position: 'absolute', right: '25%', top: '65%'},
});
