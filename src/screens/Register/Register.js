import React, {useState} from 'react';
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
import {assets, MAX_HEIGHT, phoneReg} from '../../utils';
import {loginByPass} from '../../api/auth';
import {useAuth} from '../../providers/AuthProvider';
import ImagePicker from 'react-native-image-crop-picker';
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';

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

  const register = () => {};
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
          <Pressable
            onPress={() =>
              ImagePicker?.openPicker({
                width: 300,
                height: 300,
                cropping: true,
                includeBase64: true,
                cropperCircleOverlay: true,
              }).then(image => {
                setImg(`data:${image.mime};base64,${image.data}`);
              })
            }>
            <Image
              source={img ? {uri: img} : assets.profilePlaceholder}
              style={styles.profilePlaceholder}
            />
          </Pressable>
          <Divider m={20} />
          <WidthContainer>
            <TextField
              label={'first name'}
              onChangeText={setPassword}
              error={errors?.password}
            />
          </WidthContainer>
          <Divider m={15} />
          <WidthContainer>
            <TextField
              label={'last name'}
              onChangeText={setPassword}
              error={errors?.password}
            />
          </WidthContainer>
          <Divider m={15} />
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
            />
          </WidthContainer>
          <Divider m={15} />
          <WidthContainer>
            <TextField
              label={'email'}
              keyboardType="email-address"
              onChangeText={setEmail}
              error={errors?.password}
            />
          </WidthContainer>
          <Divider m={15} />
          <WidthContainer>
            <TextField
              label={'repeat password'}
              onChangeText={setRepeatedPassword}
              error={errors?.password}
            />
          </WidthContainer>
        </View>
        <View style={rootStyles.mb5}>
          <MainBtn onPress={register}>Register</MainBtn>
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
});
