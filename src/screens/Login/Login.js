import React, {useState} from 'react';
import {KeyboardAvoidingView, Text, View, ScrollView} from 'react-native';
import MainBtn from '../../components/MainBtn';
import TextField from '../../components/TextField';
import {useTheme} from '../../providers/StyleProvider';
import {WidthContainer, Divider, Logo} from '../../styles/styleComponents';
import {useHeaderHeight} from '@react-navigation/stack';
import {MAX_HEIGHT, phoneReg} from '../../utils';
import {loginByPass} from '../../api/auth';
import {useAuth} from '../../providers/AuthProvider';

export default function Login({navigation}) {
  const {colors, rootStyles} = useTheme();
  const {setCurrentUser} = useAuth();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const checkErrors = () => {
    let errorOccured;
    if (phone.length < 10) {
      setErrors(prev => ({
        ...prev,
        phone: 'Phone number missing digits',
      }));
      errorOccured = true;
    } else {
      setErrors(prev => ({...prev, phone: null}));
    }
    if (phoneReg.test(phone)) {
      setErrors(prev => ({...prev, phone: 'Phone not valid'}));
      errorOccured = true;
    } else {
      setErrors(prev => ({...prev, phone: null}));
    }
    if (password.length < 6) {
      setErrors(prev => ({...prev, password: 'Password too short'}));
      errorOccured = true;
    } else {
      setErrors(prev => ({...prev, password: null}));
    }
    return errorOccured;
  };

  const login = async () => {
    if (checkErrors()) return;
    const user = await loginByPass(phone, password);
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
          <Logo mv={30} />
          <Divider m={20} />
          <WidthContainer>
            <TextField
              label={'phone'}
              keyboardType="phone-pad"
              onChangeText={setPhone}
              error={errors?.phone}
            />
          </WidthContainer>
          <Divider m={15} />
          <WidthContainer>
            <TextField
              label={'password'}
              onChangeText={setPassword}
              error={errors?.password}
              secureTextEntry
            />
          </WidthContainer>
        </View>
        <View style={rootStyles.mb5}>
          <MainBtn onPress={login}>Sign in</MainBtn>
          <View
            style={[
              rootStyles.flexRow,
              rootStyles.alignSelfCenter,
              rootStyles.mt5,
            ]}>
            <Text
              style={[
                {color: colors.GREY},
                rootStyles.me1,
                rootStyles.fontSize16,
              ]}>
              Not with us?
            </Text>
            <Text
              onPress={() => navigation.navigate('Register')}
              style={[{color: colors.GREEN_PRIMARY}, rootStyles.fontSize16]}>
              register
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
