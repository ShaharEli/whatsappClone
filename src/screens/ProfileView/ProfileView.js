import React, {useRef} from 'react';
import {
  Image,
  SafeAreaView,
  Switch,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
  Animated,
  Modal,
} from 'react-native';
import {useTheme} from '../../providers/StyleProvider';
import {Divider, ScreenWrapper} from '../../styles/styleComponents';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {isAdmin} from '../../utils';
import If from '../../components/If';
import Feather from 'react-native-vector-icons/Feather';
import {useAuth} from '../../providers/AuthProvider';
import {useProfile} from '../../hooks';
import ParticipantsList from './ParticipantsList';
import Searchbar from '../../components/Searchbar';
import ParticipantsController from '../../components/ParticipantsController';
import styles from './style';
const AnimatedImage = Animated.createAnimatedComponent(Image);
//TODO add last active
// TODO add sockets update
export default function ProfileView({route, navigation}) {
  const scrollY = useRef(new Animated.Value(0)).current;

  const {
    animationsStyle: {
      imageOpacity,
      nameContainerTop,
      nameTranslateX,
      headerColor,
    },
    handleAddParticipant,
    editGroup,
    switchNotification,
    avatar,
    name,
    starredCount,
    loadingParticipants,
    isSearching,
    filteredParticipants,
    searchVal,
    isAdding,
    withNotifications,
    participants,
    setSearchVal,
    setIsSearching,
    setFilteredParticipants,
    setActiveParticipant,
    chat,
    setIsAdding,
    activeParticipant,
    getActiveParticipantsOptions,
    isGroup,
    profileId,
  } = useProfile(route, navigation, scrollY);
  const {user} = useAuth();
  const {rootStyles, colors} = useTheme();

  if (isSearching) {
    return (
      <ScreenWrapper>
        <SafeAreaView style={rootStyles.flex1}>
          <Searchbar
            setSearchVal={setSearchVal}
            setIsSearching={setIsSearching}
            setFilteredArr={setFilteredParticipants}
            fullArr={participants}
            searchVal={searchVal}
          />
          <ParticipantsList
            {...{
              loadingParticipants,
              participants,
              setIsSearching,
              filteredParticipants,
              isSearching,
              setActiveParticipant,
              chat,
              noBackground: true,
            }}
          />
        </SafeAreaView>
      </ScreenWrapper>
    );
  }

  if (isAdding) {
    return (
      <ParticipantsController
        {...{
          navigation,
          route,
          newStep: handleAddParticipant,
          onGoBack: () => setIsAdding(false),
          alreadyJoined: participants.map(p => p._id),
        }}
      />
    );
  }

  return (
    <ScreenWrapper>
      <Modal visible={!!activeParticipant} transparent>
        <TouchableOpacity
          style={[
            rootStyles.flex1,
            rootStyles.box,
            {backgroundColor: colors.BLACK_TRANSPARENT},
          ]}
          onPress={() => setActiveParticipant(null)}>
          <TouchableOpacity
            style={[
              rootStyles.width(0.8),
              rootStyles.alignSelfCenter,
              rootStyles.p3,
              rootStyles.shadowBox,
              {backgroundColor: colors.HEADER},
            ]}>
            {getActiveParticipantsOptions().map(({label, onPress}) => (
              <TouchableOpacity onPress={onPress} key={label}>
                <Text style={[rootStyles.font(colors), rootStyles.mb3]}>
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
      <SafeAreaView style={rootStyles.flex1}>
        <Ionicons
          name="arrow-back"
          color={colors.INACTIVE_TINT}
          size={30}
          onPress={() => {
            navigation.goBack();
            route?.params?.onGoBack?.();
          }}
          style={styles.backArrow}
        />
        <Animated.View
          style={[
            styles.nameContainer,
            {
              top: nameContainerTop,
              backgroundColor: headerColor,
            },
          ]}>
          <Animated.Text
            style={[
              styles.name(rootStyles, colors),
              {transform: [{translateX: nameTranslateX}]},
            ]}>
            {name}
          </Animated.Text>
          <View style={[rootStyles.flexRow, rootStyles.alignCenter]}>
            {isGroup && (
              <Feather
                name="edit-2"
                size={20}
                color={colors.font}
                style={rootStyles.mx3}
                onPress={() => editGroup('name')}
              />
            )}
            {isAdmin(chat, user) && (
              <Ionicons
                onPress={() => setIsAdding(true)}
                color={colors.font}
                size={20}
                name="person-add-outline"
              />
            )}
          </View>
        </Animated.View>
        <Animated.ScrollView
          nestedScrollEnabled
          bounces={false}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {y: scrollY}}}],
            {useNativeDriver: false},
          )}>
          <If
            cond={!!name}
            message="Error not found"
            onPress={() => {
              route?.params?.onGoBack?.();
              navigation.goBack();
            }}>
            <AnimatedImage
              source={avatar}
              style={[styles.image, {opacity: imageOpacity}]}
            />
            <If cond={isGroup}>
              <Divider m={10} />
              <TouchableOpacity
                style={styles.block(colors, rootStyles)}
                onPress={() => editGroup('description')}>
                {chat?.description ? (
                  <>
                    <Text style={styles.descColor(colors)}>Description</Text>
                    <Text style={rootStyles.font(colors)}>
                      {chat.description}
                    </Text>
                  </>
                ) : (
                  <Text style={rootStyles.font(colors)}>Add description</Text>
                )}
              </TouchableOpacity>
            </If>
            <Divider m={10} />
            <If cond={profileId !== user._id}>
              <View
                style={[
                  styles.block(colors),
                  rootStyles.flexRow,
                  rootStyles.alignCenter,
                  rootStyles.spaceBetween,
                  rootStyles.px4,
                ]}>
                <Text style={rootStyles.font(colors)}>
                  Silent notifications
                </Text>
                <Switch
                  value={withNotifications}
                  onValueChange={switchNotification}
                />
              </View>
              <Divider bg={colors.GREY} h={1} />
            </If>
            <TouchableHighlight
              underlayColor={colors.HIGHLIGHT}
              onPress={() => {
                navigation.navigate('Media', {chat});
              }}
              style={[
                styles.block(colors),
                rootStyles.px4,
                rootStyles.justifyCenter,
              ]}>
              <Text style={rootStyles.font(colors)}>Show media</Text>
            </TouchableHighlight>
            <Divider bg={colors.GREY} h={1} />
            <TouchableHighlight
              underlayColor={colors.HIGHLIGHT}
              onPress={() => {
                navigation.navigate('FavoriteMsgs', {chat});
              }}
              style={[
                styles.block(colors),
                rootStyles.px4,
                rootStyles.flexRow,
                rootStyles.alignCenter,
                rootStyles.spaceBetween,
              ]}>
              <>
                <Text style={rootStyles.font(colors)}>Starred messages</Text>
                {starredCount !== null && (
                  <Text style={[rootStyles.font(colors), rootStyles.me5]}>
                    {starredCount}
                  </Text>
                )}
              </>
            </TouchableHighlight>
            <If cond={isGroup}>
              <Divider bg={colors.GREY} h={1} />
              <ParticipantsList
                {...{
                  loadingParticipants,
                  participants,
                  setIsSearching,
                  filteredParticipants,
                  isSearching,
                  setActiveParticipant,
                  chat,
                }}
              />
              <If cond={isGroup && isAdmin(chat, user)}></If>
            </If>
          </If>
        </Animated.ScrollView>
      </SafeAreaView>
    </ScreenWrapper>
  );
}
