import React, { ReactElement, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { TicketRepository } from '@homzhub/common/src/domain/repositories/TicketRepository';
import { AssetActions } from '@homzhub/common/src/modules/asset/actions';
import { AssetSelectors } from '@homzhub/common/src/modules/asset/selectors';
import { TicketSelectors } from '@homzhub/common/src/modules/tickets/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Dropdown } from '@homzhub/common/src/components/atoms/Dropdown';
import { Text, Label } from '@homzhub/common/src/components/atoms/Text';
import { TextArea } from '@homzhub/common/src/components/atoms/TextArea';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { IReassignTicketParam } from '@homzhub/common/src/domain/repositories/interfaces';

const ReassignTicket = (): ReactElement => {
  const dispatch = useDispatch();
  const { goBack } = useNavigation();
  const { t } = useTranslation(LocaleConstants.namespacesKey.serviceTickets);

  const [reassignedTo, setReassignedTo] = useState<number>(-1);
  const [comment, setComment] = useState('');
  const [isLoading, setLoader] = useState(false);

  const selectedTicket = useSelector(TicketSelectors.getCurrentTicket);
  const assetUsers = useSelector(AssetSelectors.getAssetUser);
  const { assetUser: assetUsersLoading } = useSelector(AssetSelectors.getAssetLoaders);

  useEffect(() => {
    if (selectedTicket?.assetId) {
      dispatch(
        AssetActions.getAssetUsers({
          assetId: selectedTicket.assetId,
        })
      );
    }
  }, []);

  // HANDLERS

  const onSubmit = async (): Promise<void> => {
    try {
      if (selectedTicket) {
        setLoader(true);
        const payload: IReassignTicketParam = {
          assigned_to: reassignedTo,
          comment: comment.length > 0 ? comment : undefined,
        };
        await TicketRepository.reassignTicket(selectedTicket.ticketId, payload);
        AlertHelper.success({ message: t('requestReassignedSuccessfully') });
        setLoader(false);
        goBack();
      }
    } catch (e) {
      setLoader(false);
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details.message), statusCode: e.details.statusCode });
    }
  };

  // HANDLERS

  return (
    <UserScreen
      title={selectedTicket?.propertyName ?? ''}
      pageTitle={t('reassignRequest')}
      onBackPress={goBack}
      loading={isLoading || assetUsersLoading}
    >
      <View style={styles.container}>
        <Text type="small" textType="semiBold">
          {t('assigneeDetails')}
        </Text>
        <Label type="large" style={styles.description}>
          {t('reassignInfoText')}
        </Label>

        <Dropdown
          data={[...(assetUsers?.owners ?? []), ...(assetUsers?.tenants ?? [])]}
          icon={icons.downArrowFilled}
          iconColor={theme.colors.darkTint5}
          iconSize={15}
          value={reassignedTo}
          onDonePress={setReassignedTo}
          listHeight={theme.viewport.height / 2}
          placeholder={t('selectAnAssignee')}
        />

        <TextArea
          value={comment}
          label={t('common:comment')}
          helpText={t('common:optional')}
          placeholder={t('common:typeComment')}
          wordCountLimit={450}
          onMessageChange={setComment}
          containerStyle={styles.commentBox}
        />
        <Button type="primary" title={t('reassign')} disabled={reassignedTo === -1} onPress={onSubmit} />
      </View>
    </UserScreen>
  );
};

export default ReassignTicket;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  description: {
    color: theme.colors.darkTint3,
    marginVertical: 12,
  },
  commentBox: {
    marginVertical: 20,
  },
});
