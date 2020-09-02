import React from 'react';
import { StyleSheet, View } from 'react-native';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Label } from '@homzhub/common/src/components';

interface IProps {
  document: any;
  handleShare: () => void;
}

export const DocumentCard = ({ document, handleShare }: IProps): React.ReactElement => {
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.leftView}>
          <Label type="large" textType="semiBold" style={styles.title}>
            {document.name}
          </Label>
          <Label type="regular" style={styles.description}>
            {`Uploaded on: ${document.uploaded_on}, by ${document.uploaded_by}`}
          </Label>
        </View>
        <Icon name={icons.doc} size={35} color={theme.colors.lowPriority} />
      </View>
      <View style={styles.iconContainer}>
        <Icon name={icons.trash} size={22} color={theme.colors.blue} style={styles.iconStyle} />
        <Icon
          name={icons.shareFilled}
          size={22}
          color={theme.colors.blue}
          style={styles.iconStyle}
          onPress={handleShare}
        />
        <Icon name={icons.download} size={22} color={theme.colors.blue} style={styles.iconStyle} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 6,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 18,
  },
  leftView: {},
  title: {
    color: theme.colors.darkTint3,
  },
  description: {
    color: theme.colors.darkTint5,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconStyle: {
    marginEnd: 28,
  },
});
