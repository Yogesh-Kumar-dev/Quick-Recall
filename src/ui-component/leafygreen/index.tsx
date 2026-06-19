import type { ComponentType } from 'react';

// leafygreen
import { Button, type ButtonProps, Variant as ButtonVariant, Size as ButtonSize } from '@leafygreen-ui/button';
import { Card, type CardProps } from '@leafygreen-ui/card';
import { Badge, Variant as BadgeVariant } from '@leafygreen-ui/badge';
import { BasicEmptyState, type BasicEmptyStateProps } from '@leafygreen-ui/empty-state';
import { Callout, type CalloutProps, Variant as CalloutVariant } from '@leafygreen-ui/callout';
import { Banner, type BannerProps, Variant as BannerVariant } from '@leafygreen-ui/banner';
import { Code, type CodeProps, Language as CodeLanguage, CopyButtonAppearance } from '@leafygreen-ui/code';
import { ExpandableCard, type ExpandableCardProps } from '@leafygreen-ui/expandable-card';
import { Modal, type ModalProps, ModalSize } from '@leafygreen-ui/modal';
import { ConfirmationModal, type ConfirmationModalProps, Variant as ConfirmationModalVariant } from '@leafygreen-ui/confirmation-modal';
import { ProgressBar, type ProgressBarProps, Variant as ProgressBarVariant, Size as ProgressBarSize } from '@leafygreen-ui/progress-bar';
import { PreviewCard, type PreviewCardProps } from '@leafygreen-ui/preview-card';
import { TextInput, type TextInputProps, State as TextInputState, SizeVariant as TextInputSize } from '@leafygreen-ui/text-input';
import { TextArea, type TextAreaProps, State as TextAreaState } from '@leafygreen-ui/text-area';
import { Select, type SelectProps, Option, OptionGroup, Size as SelectSize, State as SelectState } from '@leafygreen-ui/select';
// NOTE: @leafygreen-ui/toast is intentionally NOT used. Its react-transition-group usage omits
// `nodeRef`, so it calls the removed `ReactDOM.findDOMNode` and crashes on React 19. The app's
// notifications render via MUI Snackbar instead (see ui-component/extended/Snackbar.tsx).
// ExpandableCard is safe because it DOES pass `nodeRef` to its transitions.

// ==============================|| LEAFYGREEN COMPONENT BARREL ||============================== //
//
// Real @leafygreen-ui components, re-exported under LG* names so showcase spots have a single
// import path and the LeafyGreen dependency stays localized. These follow the app's light/dark
// toggle automatically via <LeafyGreenBridge> (mounted in ProviderWrapper), which maps our
// ConfigContext mode onto LeafyGreen's own dark-mode context.
//
// LeafyGreen ships its own Emotion instance (separate from MUI), so these can be mixed with MUI
// components in the same tree. Prefer these only for deliberate high-visibility spots — the rest
// of the app stays on themed-MUI to avoid running two styling systems everywhere.
//
// NOTE: Button and Card are LeafyGreen *polymorphic* components whose generated types
// (`InferredPolymorphicComponentType`) aren't recognized as valid JSX element types under React 19.
// We re-type them as plain ComponentTypes so they're usable as `<LGButton/>` / `<LGCard/>`. Badge
// is non-polymorphic and needs no cast.

export const LGButton = Button as ComponentType<ButtonProps>;
export const LGCard = Card as ComponentType<CardProps>;
export const LGBadge = Badge;
export const LGEmptyState = BasicEmptyState as ComponentType<BasicEmptyStateProps>;
export const LGCallout = Callout as ComponentType<CalloutProps>;
export const LGBanner = Banner as ComponentType<BannerProps>;
export const LGCode = Code as ComponentType<CodeProps>;
export const LGExpandableCard = ExpandableCard as ComponentType<ExpandableCardProps>;
export const LGModal = Modal as ComponentType<ModalProps>;
export const LGConfirmationModal = ConfirmationModal as ComponentType<ConfirmationModalProps>;
export const LGProgressBar = ProgressBar as ComponentType<ProgressBarProps>;
export const LGPreviewCard = PreviewCard as ComponentType<PreviewCardProps>;
export const LGTextInput = TextInput as ComponentType<TextInputProps>;
export const LGTextArea = TextArea as ComponentType<TextAreaProps>;
export const LGSelect = Select as ComponentType<SelectProps>;
export const LGOption = Option;
export const LGOptionGroup = OptionGroup;

export {
  ButtonVariant as LGButtonVariant,
  ButtonSize as LGButtonSize,
  BadgeVariant as LGBadgeVariant,
  CalloutVariant as LGCalloutVariant,
  BannerVariant as LGBannerVariant,
  CodeLanguage as LGCodeLanguage,
  CopyButtonAppearance as LGCopyButtonAppearance,
  ModalSize as LGModalSize,
  ConfirmationModalVariant as LGConfirmationModalVariant,
  ProgressBarVariant as LGProgressBarVariant,
  ProgressBarSize as LGProgressBarSize,
  TextInputState as LGTextInputState,
  TextInputSize as LGTextInputSize,
  TextAreaState as LGTextAreaState,
  SelectSize as LGSelectSize,
  SelectState as LGSelectState
};
