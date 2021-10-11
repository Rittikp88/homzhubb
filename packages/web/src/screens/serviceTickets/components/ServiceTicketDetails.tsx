import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, ViewStyle, PickerItemProps } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { PopupActions } from 'reactjs-popup/dist/types';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { NavigationService } from '@homzhub/web/src/services/NavigationService';
import { TicketActions } from '@homzhub/common/src/modules/tickets/actions';
import { TicketSelectors } from '@homzhub/common/src/modules/tickets/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import { ImagePlaceholder } from '@homzhub/common/src/components/atoms/ImagePlaceholder';
import ListViewPopup from '@homzhub/web/src/components/molecules/ListViewPopup';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import { AssetDetailsImageCarousel } from '@homzhub/common/src/components/molecules/AssetDetailsImageCarousel';
import TicketActivityCard from '@homzhub/common/src/components/molecules/TicketActivity';
import TicketDetailsCard from '@homzhub/common/src/components/molecules/TicketDetailsCard';
import ActiveTicketActionsPopover from '@homzhub/web/src/screens/serviceTickets/components/ActiveTicketActionsPopover';
import { Ticket } from '@homzhub/common/src/domain/models/Ticket';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { ICurrentTicket } from '@homzhub/common/src/modules/tickets/interface';
import { TicketActions as TicketActionTypes } from '@homzhub/common/src/constants/ServiceTickets';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

interface ITicketAction {
    title: string;
    onPress: () => void;
    isDisabled: boolean;
}

const ServiceTicketDetails: React.FC = () => {
    const { t } = useTranslation();
    const isSingleColumn = useDown(deviceBreakpoint.TABLET);
    const dispatch = useDispatch();
    const { getCurrentTicket, getTicketDetail,
        getTicketDetailLoader, getTicketLoaders,
        getTicketActions } = TicketSelectors;
    const currentTicket = useSelector((state: IState) => getCurrentTicket(state));
    const ticketDetails = useSelector((state: IState) => getTicketDetail(state));
    const isLoading = useSelector((state: IState) => getTicketDetailLoader(state));
    const ticketLoader = useSelector((state: IState) => getTicketLoaders(state));
    const ticketActions = useSelector((state: IState) => getTicketActions(state));
    const history = useHistory<ICurrentTicket>();
    const { location: { state: { ticketId, assetId, assignedUserId } } } = history;
    const getActionList = (): PickerItemProps[] => {
        if (!ticketActions) return [];

        // Excluding close ticket option from list
        return ticketActions
            .filter((actions) => actions.code !== TicketActionTypes.CLOSE_TICKET)
            .map((item) => {
                return {
                    label: item.label,
                    value: item.code,
                };
            });
    };
    const actionList = getActionList();
    const { getTicketDetail: getTicketDetailAction, setCurrentTicket } = TicketActions;
    useEffect(() => {
        if (currentTicket) {
            dispatch(getTicketDetailAction(currentTicket.ticketId));
        }
        else {
            dispatch(setCurrentTicket({ ticketId, assetId, assignedUserId }));
            dispatch(getTicketDetailAction(ticketId));
        }
    }, []);

    const renderRatingSheet = (): React.ReactElement => {
        return (<View />)
    };

    const renderCarousel = (detail: Ticket): React.ReactElement => {
        if (!detail.ticketAttachments.length) {
            return <ImagePlaceholder height="100%" containerStyle={styles.carousel} />;
        }

        return (
            <AssetDetailsImageCarousel
                data={detail.ticketAttachments}
            />
        );
    };

    const renderDetailsCard = (): React.ReactElement | null => {
        if (!ticketDetails) return null;
        return (
            <TicketDetailsCard
                ticketData={ticketDetails}
                ticketImages={renderCarousel(ticketDetails)}
                renderRatingForm={renderRatingSheet}
                successCallback={FunctionUtils.noop}
            />
        );
    };
    const handleQuoteClick = async (url: string): Promise<void> => {
        await NavigationService.openNewTab({ path: url });
    };
    const renderActivityCard = (): React.ReactElement | null => {
        if (!ticketDetails) return null;

        // Check close ticket action is allowed or not
        const isCloseAllowed = ticketActions.find((item) => item.code === TicketActionTypes.CLOSE_TICKET)?.isAllowed;
        return (
            <View style={styles.containerParentActivity}>
                <TicketActivityCard
                    ticketData={ticketDetails}
                    isCloseAllowed={isCloseAllowed}
                    onPressQuote={handleQuoteClick}
                    onPressImage={(slideNumber: number) => { }}
                    containerStyle={styles.containerPropActivity as ViewStyle}
                />
            </View>
        );
    };

    // Take action button logic
    const getActionData = (): ITicketAction | null => {
        if (!ticketActions) return null;

        const nextAction = ticketActions.filter((item) => item.isNext && item.code !== TicketActionTypes.CLOSE_TICKET)[0];
        if (!nextAction) return null;
        return {
            title: nextAction.label,
            onPress: (): void => onPressAction(nextAction.code as TicketActionTypes),
            isDisabled: !nextAction.isAllowed,
        };
    };

    const renderActionButton = (): React.ReactElement | null => {
        if (!ticketDetails) return null;
        const buttonData = getActionData();
        if (!buttonData) return null;

        return (
            <View style={styles.buttonContainer}>
                <Button type="primary" title={buttonData.title} disabled={buttonData.isDisabled} onPress={buttonData.onPress} containerStyle={styles.nextActionButton} />
                <Button
                    type="primary"
                    iconSize={20}
                    icon={icons.downArrow}
                    iconColor={theme.colors.white}
                    containerStyle={styles.iconButton}
                    onPress={onOpenPopoverList}
                />
            </View>
        );
    };

    const [activeTicketType, setActiveTicketType] = useState<TicketActionTypes | null>(null);
    const onPressAction = (code: TicketActionTypes): void => {
        setActiveTicketType(code as TicketActionTypes);
        onOpenModal();
    };

    const popupRef = useRef<PopupActions>(null);
    const onOpenModal = (): void => {
        if (popupRef && popupRef.current) {
            popupRef.current.open();
        }
    };
    const onCloseModal = (): void => {
        if (popupRef && popupRef.current) {
            popupRef.current.close();
        }
    };
    const popupRefList = useRef<PopupActions>(null);
    const onOpenPopoverList = (): void => {
        if (popupRefList && popupRefList.current) {
            popupRefList.current.open();
        }
    };
    const onClosePopoverList = (): void => {
        if (popupRefList && popupRefList.current) {
            popupRefList.current.close();
        }
    };
    const onSelectItem = (value: TicketActionTypes) => {
        const { REQUEST_QUOTE, SUBMIT_QUOTE } = TicketActionTypes;
        if (value === REQUEST_QUOTE || value === SUBMIT_QUOTE) {
            onPressAction(value);
        }
    };
    const onSuccess = () => {
        onCloseModal();
        dispatch(getTicketDetailAction(ticketId));
        AlertHelper.success({ message: t('serviceTickets:ticketActionSuccess') });
    };
    if (!isLoading && !ticketDetails) {
        return (
            <View style={styles.emptyContainer}>
                <EmptyState isIconRequired={false} title={t('serviceTickets:noDetail')} />
            </View>
        )
    }
    return (
        <View style={[styles.container, isSingleColumn && styles.containerSingleColumn]}>
            <View style={[styles.containerDetails, isSingleColumn && styles.containerDetailsTabDown]}>
                <Typography size="regular" variant="text" fontWeight="semiBold">
                    {t('serviceTickets:ticketDetailsTitle')}
                </Typography>
                <View style={styles.subContainerDetails}>
                    {renderDetailsCard()}
                </View>
            </View>
            <View style={[styles.containerActivity, isSingleColumn && styles.containerActivityTabDown]}>
                {renderActivityCard()}
                {renderActionButton()}
            </View>
            <ListViewPopup
                popupRef={popupRefList}
                onCloseModal={onClosePopoverList}
                data={actionList}
                listTitle={t('chooseAction')}
                onSelectItem={(value => onSelectItem(value))}
            />
            <ActiveTicketActionsPopover
                activeTicketActionType={activeTicketType}
                popupRef={popupRef}
                onCloseModal={onCloseModal}
                onSuccessCallback={onSuccess}
            />
        </View>
    )
};

export default ServiceTicketDetails;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
    },
    containerSingleColumn: {
        flexDirection: 'column',
    },
    emptyContainer: {
        width: '100%',
    },
    containerDetails: {
        width: '64%',
        backgroundColor: theme.colors.white,
        padding: 16,
    },
    containerDetailsTabDown: {
        width: '100%',
    },
    subContainerDetails: {
        marginVertical: 16
    },
    containerActivity: {
        width: '36%',
        marginLeft: 32,
        backgroundColor: theme.colors.white,
        padding: 8,
    },
    containerActivityTabDown: {
        width: '100%',
        marginLeft: 0,
        marginTop: 20,
    },
    containerParentActivity: {
        backgroundColor: theme.colors.white,
    },
    containerPropActivity: {
        backgroundColor: theme.colors.white,
        height: theme.viewport.height,
        overflow: 'hidden'
    },
    carousel: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: 160,
        marginHorizontal: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        padding: 20,
        backgroundColor: theme.colors.white,
    },
    nextActionButton: {
        flex: 0.8,
    },
    iconButton: {
        flex: 0.2,
        marginLeft: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
})