/* eslint-disable jsx-a11y/interactive-supports-focus */
import React, { useState } from 'react';
import { Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { useOnly } from '@homzhub/common/src/utils/MediaQueryUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import { ValueAddedService } from '@homzhub/common/src/domain/models/ValueAddedService';
import { ServiceBundleItems } from '@homzhub/common/src/domain/models/ServiceBundleItems';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';
import '@homzhub/web/src/screens/membershipPlans/components/ServicePlansCard.scss';

interface IProps {
  servicePlan: ValueAddedService;
}

const ServicePlansCard: React.FC<IProps> = (props: IProps) => {
  const { servicePlan } = props;
  const { isPartial, valueBundle, priceLabel } = servicePlan;
  const { label, description, id, attachment, valueBundleItems } = valueBundle;
  const isMobile = useOnly(deviceBreakpoint.MOBILE);

  const minInvoiceAmount = 10000 / 1000;
  const { t } = useTranslation();
  const [isKnowMore, setIsKnowMore] = useState(false);

  const renderBulletList = (item: ServiceBundleItems): React.ReactElement => {
    return (
      <li key={item.id} className="service-plans-card-features-li">
        <Typography variant="label" size="large" fontWeight="regular">
          {item.label}{' '}
        </Typography>
      </li>
    );
  };

  const toggleShowMore = (): void => {
    setIsKnowMore(!isKnowMore);
  };

  return (
    <div
      className={isKnowMore ? 'service-plans-card expanded-view' : 'service-plans-card collapsed-view'}
      id={`service-plans-card-${id}`}
      key={id}
    >
      <div className="service-plans-card-content">
        <div className="service-plans-card-image">
          <Image source={{ uri: attachment.link }} style={{ height: 40, width: 40 }} />
        </div>
        <div className="service-plans-card-label">
          <Typography size="regular" fontWeight="semiBold">
            {label}
          </Typography>
        </div>
        <br />
        <div className="service-plans-card-description">
          <Typography size="small" fontWeight="regular">
            {description}
          </Typography>
        </div>
        <div className="service-plans-card-price-label-container">
          {isPartial && (
            <>
              <div className="service-plans-card-price-label">
                <Typography
                  variant="label"
                  size="regular"
                  fontWeight="regular"
                  style={{ color: theme.colors.darkTint5 }}
                >
                  {t('common:totalServiceFees')}
                </Typography>
              </div>

              <div className="service-plans-card-price-title">
                <Typography variant="text" size="regular" fontWeight="regular">
                  {priceLabel}
                </Typography>
                <br />
                <Typography variant="label" size="regular" fontWeight="regular">
                  {t('common:servicePlansSubText', { minInvoiceAmount })}
                </Typography>
              </div>
            </>
          )}
        </div>
        <div
          className={
            isKnowMore
              ? 'service-plans-card-features-container know-more-container'
              : 'service-plans-card-features-container know-less-container'
          }
        >
          <ul>
            {valueBundleItems
              .sort((a, b) => Number(a.displayOrder) - Number(b.displayOrder))
              .map((item) => (
                <>{isKnowMore ? renderBulletList(item) : item.displayOrder <= 4 ? renderBulletList(item) : null}</>
              ))}
          </ul>
        </div>
        <div className="button-container">
          {isMobile && (
            <div
              className="service-plans-know-more-button"
              role="button"
              onClick={toggleShowMore}
              onKeyDown={toggleShowMore}
            >
              {isKnowMore ? t('common:knowLess') : t('common:knowMore')}
            </div>
          )}
          <div className="service-plans-card-button">
            <Button
              type="primary"
              title={t('getStarted')}
              fontType="semiBold"
              textSize="small"
              onPress={FunctionUtils.noop}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicePlansCard;
