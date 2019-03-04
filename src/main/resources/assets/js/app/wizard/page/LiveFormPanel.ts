import {ContentWizardPanel} from '../ContentWizardPanel';
import {DefaultModels} from './DefaultModels';
import {LiveEditPageProxy} from './LiveEditPageProxy';
import {TextInspectionPanel} from './contextwindow/inspect/region/TextInspectionPanel';
import {ContentInspectionPanel} from './contextwindow/inspect/ContentInspectionPanel';
import {RegionInspectionPanel} from './contextwindow/inspect/region/RegionInspectionPanel';
import {ImageInspectionPanel} from './contextwindow/inspect/region/ImageInspectionPanel';
import {LayoutInspectionPanel} from './contextwindow/inspect/region/LayoutInspectionPanel';
import {FragmentInspectionPanel} from './contextwindow/inspect/region/FragmentInspectionPanel';
import {PartInspectionPanel} from './contextwindow/inspect/region/PartInspectionPanel';
import {PageInspectionPanel} from './contextwindow/inspect/page/PageInspectionPanel';
import {InspectionsPanel, InspectionsPanelConfig} from './contextwindow/inspect/InspectionsPanel';
import {InsertablesPanel} from './contextwindow/insert/InsertablesPanel';
import {ContextWindowController} from './contextwindow/ContextWindowController';
import {ContextWindow, ContextWindowConfig} from './contextwindow/ContextWindow';
import {ShowContentFormEvent} from '../ShowContentFormEvent';
import {SaveAsTemplateAction} from '../action/SaveAsTemplateAction';
import {ShowLiveEditEvent} from '../ShowLiveEditEvent';
import {ShowSplitEditEvent} from '../ShowSplitEditEvent';
import {LiveEditModel} from '../../../page-editor/LiveEditModel';
import {PageView} from '../../../page-editor/PageView';
import {ComponentView} from '../../../page-editor/ComponentView';
import {LiveEditPageViewReadyEvent} from '../../../page-editor/LiveEditPageViewReadyEvent';
import {LiveEditPageInitializationErrorEvent} from '../../../page-editor/LiveEditPageInitializationErrorEvent';
import {PartComponentView} from '../../../page-editor/part/PartComponentView';
import {LayoutComponentView} from '../../../page-editor/layout/LayoutComponentView';
import {RegionView} from '../../../page-editor/RegionView';
import {PageSelectedEvent} from '../../../page-editor/PageSelectedEvent';
import {RegionSelectedEvent} from '../../../page-editor/RegionSelectedEvent';
import {ItemViewSelectedEvent} from '../../../page-editor/ItemViewSelectedEvent';
import {ItemViewDeselectedEvent} from '../../../page-editor/ItemViewDeselectedEvent';
import {ComponentAddedEvent} from '../../../page-editor/ComponentAddedEvent';
import {TextComponentView} from '../../../page-editor/text/TextComponentView';
import {ComponentRemovedEvent} from '../../../page-editor/ComponentRemovedEvent';
import {ComponentViewDragDroppedEvent} from '../../../page-editor/ComponentViewDragDroppedEventEvent';
import {ComponentDuplicatedEvent} from '../../../page-editor/ComponentDuplicatedEvent';
import {ComponentInspectedEvent} from '../../../page-editor/ComponentInspectedEvent';
import {PageInspectedEvent} from '../../../page-editor/PageInspectedEvent';
import {ComponentFragmentCreatedEvent} from '../../../page-editor/ComponentFragmentCreatedEvent';
import {FragmentComponentView} from '../../../page-editor/fragment/FragmentComponentView';
import {FragmentComponentReloadRequiredEvent} from '../../../page-editor/FragmentComponentReloadRequiredEvent';
import {ShowWarningLiveEditEvent} from '../../../page-editor/ShowWarningLiveEditEvent';
import {PageUnloadedEvent} from '../../../page-editor/PageUnloadedEvent';
import {ImageComponentView} from '../../../page-editor/image/ImageComponentView';
import {PageModel} from '../../../page-editor/PageModel';
import {ComponentDetachedFromFragmentEvent} from '../../../page-editor/ComponentDetachedFromFragmentEvent';
import {BeforeContentSavedEvent} from '../../event/BeforeContentSavedEvent';
import {HTMLAreaDialogHandler} from '../../inputtype/ui/text/dialog/HTMLAreaDialogHandler';
import {CreateHtmlAreaDialogEvent} from '../../inputtype/ui/text/CreateHtmlAreaDialogEvent';
import {UriHelper} from '../../rendering/UriHelper';
import {RenderingMode} from '../../rendering/RenderingMode';
import {ContentServerEventsHandler} from '../../event/ContentServerEventsHandler';
import {ContentDeletedEvent} from '../../event/ContentDeletedEvent';
import {ContentUpdatedEvent} from '../../event/ContentUpdatedEvent';
import {EditContentEvent} from '../../event/EditContentEvent';
import {Branch} from '../../versioning/Branch';
import {Content} from '../../content/Content';
import {Site} from '../../content/Site';
import {ContentSummaryAndCompareStatus} from '../../content/ContentSummaryAndCompareStatus';
import {Component} from '../../page/region/Component';
import {Page} from '../../page/Page';
import {DescriptorBasedComponent} from '../../page/region/DescriptorBasedComponent';
import {ComponentPropertyChangedEvent} from '../../page/region/ComponentPropertyChangedEvent';
import {PartComponent} from '../../page/region/PartComponent';
import {LayoutComponent} from '../../page/region/LayoutComponent';
import {ImageComponent} from '../../page/region/ImageComponent';
import {FragmentComponent} from '../../page/region/FragmentComponent';
import {ComponentPath} from '../../page/region/ComponentPath';
import {PageMode} from '../../page/PageMode';
import {RepositoryId} from '../../repository/RepositoryId';
import ContentTypeName = api.schema.content.ContentTypeName;
import Panel = api.ui.panel.Panel;
import i18n = api.util.i18n;

export interface LiveFormPanelConfig {

    contentType: ContentTypeName;

    contentWizardPanel: ContentWizardPanel;

    defaultModels: DefaultModels;
}

export interface PageEditorData {
    contextWindow?: ContextWindow;
    liveFormPanel?: LiveFormPanel;
}

export class LiveFormPanel
    extends api.ui.panel.Panel {

    public static debug: boolean = false;

    private defaultModels: DefaultModels;

    private content: Content;

    private liveEditModel: LiveEditModel;

    private pageView: PageView;

    private pageModel: PageModel;

    private pageLoading: boolean;

    private pageSkipReload: boolean;
    private frameContainer: Panel;

    private lockPageAfterProxyLoad: boolean;

    private contextWindow: ContextWindow;
    private contextWindowController: ContextWindowController;

    private insertablesPanel: InsertablesPanel;
    private inspectionsPanel: InspectionsPanel;
    private contentInspectionPanel: ContentInspectionPanel;
    private pageInspectionPanel: PageInspectionPanel;
    private regionInspectionPanel: RegionInspectionPanel;
    private imageInspectionPanel: ImageInspectionPanel;
    private partInspectionPanel: PartInspectionPanel;
    private layoutInspectionPanel: LayoutInspectionPanel;
    private fragmentInspectionPanel: FragmentInspectionPanel;
    private textInspectionPanel: TextInspectionPanel;

    private contentWizardPanel: ContentWizardPanel;

    private liveEditPageProxy: LiveEditPageProxy;

    private contentEventListener: (event: any) => void;

    private saveAsTemplateAction: SaveAsTemplateAction;

    private showLoadMaskHandler: () => void;
    private hideLoadMaskHandler: () => void;
    private componentPropertyChangedHandler: (event: ComponentPropertyChangedEvent) => void;
    private propertyChangedHandler: (event: api.PropertyChangedEvent) => void;
    private contentUpdatedHandler: (data: ContentSummaryAndCompareStatus[]) => void;

    private pageViewReadyListeners: { (pageView: PageView): void }[];

    constructor(config: LiveFormPanelConfig) {
        super('live-form-panel');
        this.contentWizardPanel = config.contentWizardPanel;
        this.defaultModels = config.defaultModels;

        this.pageLoading = false;
        this.pageSkipReload = false;
        this.lockPageAfterProxyLoad = false;

        this.saveAsTemplateAction = new SaveAsTemplateAction();

        this.liveEditPageProxy = this.createLiveEditPageProxy();

        this.contextWindow = this.createContextWindow(this.liveEditPageProxy, this.liveEditModel);

        // constructor to listen to live edit events during wizard rendering
        this.contextWindowController = new ContextWindowController(
            this.contextWindow,
            this.contentWizardPanel
        );

        this.pageViewReadyListeners = [];

        this.initEventHandlers();

        ShowLiveEditEvent.on(this.showLoadMaskHandler);
        ShowSplitEditEvent.on(this.showLoadMaskHandler);
        ShowContentFormEvent.on(this.hideLoadMaskHandler);
        ContentServerEventsHandler.getInstance().onContentUpdated(this.contentUpdatedHandler);
        ContentServerEventsHandler.getInstance().onContentPermissionsUpdated(this.contentUpdatedHandler);
    }

    private initEventHandlers() {
        this.initMaskHandlers();
        this.initPropertyChangedHandlers();
        this.initContentUpdatedHandler();
    }

    private initMaskHandlers() {
        this.showLoadMaskHandler = () => {
            // in case someone tries to open live edit while it's still not loaded
            if (this.pageLoading && !this.liveEditPageProxy.isPlaceholderVisible()) {
                this.contentWizardPanel.getLiveMask().show();
            }
        };

        this.hideLoadMaskHandler = () => {
            const liveEditMask = this.contentWizardPanel.getLiveMask();
            // in case someone tries to open live edit while it's still not loaded
            if (!!liveEditMask && liveEditMask.isVisible()) {
                liveEditMask.hide();
            }
        };
    }

    private initPropertyChangedHandlers() {
        this.componentPropertyChangedHandler = (event: ComponentPropertyChangedEvent) => {

            if (api.ObjectHelper.iFrameSafeInstanceOf(event.getComponent(), DescriptorBasedComponent)) {
                if (event.getPropertyName() === DescriptorBasedComponent.PROPERTY_DESCRIPTOR) {

                    const componentView = this.pageView.getComponentViewByPath(event.getPath());
                    if (componentView) {
                        if (api.ObjectHelper.iFrameSafeInstanceOf(componentView, PartComponentView)) {
                            const partView = <PartComponentView>componentView;
                            const partComponent: PartComponent = partView.getComponent();
                            if (partComponent.hasDescriptor()) {
                                this.saveAndReloadOnlyComponent(componentView);
                            }
                        } else if (api.ObjectHelper.iFrameSafeInstanceOf(componentView, LayoutComponentView)) {
                            const layoutView = <LayoutComponentView>componentView;
                            const layoutComponent: LayoutComponent = layoutView.getComponent();
                            if (layoutComponent.hasDescriptor()) {
                                this.saveAndReloadOnlyComponent(componentView);
                            }
                        }
                    } else {
                        console.debug('ComponentView by path not found: ' + event.getPath().toString());
                    }
                }
            } else if (api.ObjectHelper.iFrameSafeInstanceOf(event.getComponent(), ImageComponent)) {
                if (event.getPropertyName() === ImageComponent.PROPERTY_IMAGE && !event.getComponent().isEmpty()) {
                    const componentView = this.pageView.getComponentViewByPath(event.getPath());
                    if (componentView) {
                        this.saveAndReloadOnlyComponent(componentView);
                    }
                }
            } else if (api.ObjectHelper.iFrameSafeInstanceOf(event.getComponent(), FragmentComponent)) {
                if (event.getPropertyName() === FragmentComponent.PROPERTY_FRAGMENT && !event.getComponent().isEmpty()) {
                    const componentView = this.pageView.getComponentViewByPath(event.getPath());
                    if (componentView) {
                        this.saveAndReloadOnlyComponent(componentView);
                    }
                }
            }
        };

        this.propertyChangedHandler = (event: api.PropertyChangedEvent) => {

            // NB: To make the event.getSource() check work,
            // all calls from this to PageModel that changes a property must done with this as eventSource argument
            if (!api.ObjectHelper.objectEquals(this, event.getSource())) {

                const oldValue = event.getOldValue();
                const newValue = event.getNewValue();

                if (event.getPropertyName() === PageModel.PROPERTY_CONTROLLER && !api.ObjectHelper.objectEquals(oldValue, newValue)) {
                    this.contentWizardPanel.saveChanges().catch((error: any) => {
                        api.DefaultErrorHandler.handle(error);
                    });
                    this.minimizeContentFormPanelIfNeeded();
                }
                if (event.getPropertyName() === PageModel.PROPERTY_TEMPLATE) {

                    // do not reload page if there was no template in pageModel before and if new template is the default one -
                    // case when switching automatic template to default
                    // only reload when switching from customized with controller set back to template or automatic template
                    if (!(this.pageModel.getDefaultPageTemplate().equals(this.pageModel.getTemplate()) && !oldValue &&
                          !this.pageModel.hasController())) {
                        this.pageInspectionPanel.refreshInspectionHandler(this.liveEditModel);
                        this.lockPageAfterProxyLoad = true;
                        this.contentWizardPanel.saveChanges().catch((error: any) => {
                            api.DefaultErrorHandler.handle(error);
                        });
                    }
                }
            }
        };
    }

    private initContentUpdatedHandler() {
        this.contentUpdatedHandler = (summaryAndStatuses: ContentSummaryAndCompareStatus[]) => {
            // Update action with new content on save if it gets updated
            summaryAndStatuses.some((summaryAndStatus: ContentSummaryAndCompareStatus) => {
                if (this.content.getContentId().equals(summaryAndStatus.getContentId())) {
                    this.saveAsTemplateAction.setContentSummary(summaryAndStatuses[0].getContentSummary());
                    return true;
                }
            });
        };
    }

    private createLiveEditPageProxy(): LiveEditPageProxy {
        let liveEditPageProxy = new LiveEditPageProxy();
        liveEditPageProxy.onLoaded(() => {
            this.hideLoadMaskHandler();
            this.pageLoading = false;

            if (this.lockPageAfterProxyLoad) {
                this.pageView.setLocked(true);
                this.lockPageAfterProxyLoad = false;
            }

            this.imageInspectionPanel.refresh();
        });

        return liveEditPageProxy;
    }

    private createContextWindow(proxy: LiveEditPageProxy, model: LiveEditModel): ContextWindow { //
        this.inspectionsPanel = this.createInspectionsPanel(model, this.saveAsTemplateAction);

        this.insertablesPanel = new InsertablesPanel({
            liveEditPage: proxy,
            contentWizardPanel: this.contentWizardPanel,
            saveAsTemplateAction: this.saveAsTemplateAction
        });

        return new ContextWindow(<ContextWindowConfig>{
            liveEditPage: proxy,
            liveFormPanel: this,
            inspectionPanel: this.inspectionsPanel,
            insertablesPanel: this.insertablesPanel
        });
    }

    private createInspectionsPanel(model: LiveEditModel, saveAsTemplateAction: SaveAsTemplateAction): InspectionsPanel {
        let saveAction = new api.ui.Action(i18n('action.apply'));
        saveAction.onExecuted(() => {

            if (this.pageView) {
                const itemView = this.pageView.getSelectedView();
                if (api.ObjectHelper.iFrameSafeInstanceOf(itemView, ComponentView)) {
                    this.saveAndReloadOnlyComponent(<ComponentView<Component>> itemView);

                    return;
                }
            }

            this.contentWizardPanel.saveChanges().catch((error: any) => {
                api.DefaultErrorHandler.handle(error);
            });
        });

        this.contentInspectionPanel = new ContentInspectionPanel();

        this.pageInspectionPanel = new PageInspectionPanel(saveAsTemplateAction);
        this.partInspectionPanel = new PartInspectionPanel();
        this.layoutInspectionPanel = new LayoutInspectionPanel();
        this.imageInspectionPanel = new ImageInspectionPanel();
        this.fragmentInspectionPanel = new FragmentInspectionPanel();

        this.textInspectionPanel = new TextInspectionPanel();
        this.regionInspectionPanel = new RegionInspectionPanel();

        return new InspectionsPanel(<InspectionsPanelConfig>{
            contentInspectionPanel: this.contentInspectionPanel,
            pageInspectionPanel: this.pageInspectionPanel,
            regionInspectionPanel: this.regionInspectionPanel,
            imageInspectionPanel: this.imageInspectionPanel,
            partInspectionPanel: this.partInspectionPanel,
            layoutInspectionPanel: this.layoutInspectionPanel,
            fragmentInspectionPanel: this.fragmentInspectionPanel,
            textInspectionPanel: this.textInspectionPanel,
            saveAction: saveAction
        });
    }

    getPageEditorData(): PageEditorData {
        return {
            contextWindow: this.contextWindow,
            liveFormPanel: this
        };
    }

    static createEmptyPageEditorData(): PageEditorData {
        return {};
    }

    doRender(): Q.Promise<boolean> {
        return super.doRender().then((rendered: boolean) => {

            api.dom.WindowDOM.get().onBeforeUnload((event) => {
                console.log('onbeforeunload ' + this.liveEditModel.getContent().getDisplayName());
                // the reload is triggered by the main frame,
                // so let the live edit know it to skip the popup
                this.liveEditPageProxy.skipNextReloadConfirmation(true);
            });

            if (!this.liveEditModel.isRenderableContent()) {
                // If we are about to show blank placeholder in the editor then remove
                // 'rendering' class from the panel so that it's instantly visible
                this.removeClass('rendering');
            }

            this.frameContainer = new Panel('frame-container');
            this.frameContainer.appendChildren<api.dom.Element>(this.liveEditPageProxy.getIFrame(),
                this.liveEditPageProxy.getPlaceholderIFrame(), this.liveEditPageProxy.getDragMask());

            let noPreviewMessageEl = new api.dom.PEl('no-preview-message').setHtml(i18n('field.preview.failed'), false);

            // append mask here in order for the context window to be above
            this.appendChildren<api.dom.Element>(this.frameContainer, noPreviewMessageEl);

            // this.contextWindow.onDisplayModeChanged(() => this.maximizeContentFormPanelIfNeeded());

            this.liveEditListen();

            // delay rendered event until live edit page is fully loaded
            let liveEditDeferred = wemQ.defer<boolean>();

            this.liveEditPageProxy.onLiveEditPageViewReady((event: LiveEditPageViewReadyEvent) => {
                liveEditDeferred.resolve(rendered);
            });

            this.liveEditPageProxy.onLiveEditPageInitializationError((event: LiveEditPageInitializationErrorEvent) => {
                liveEditDeferred.reject(event.getMessage());
            });

            return liveEditDeferred.promise;
        });
    }

    remove(): LiveFormPanel {
        ShowLiveEditEvent.un(this.showLoadMaskHandler);
        ShowSplitEditEvent.un(this.showLoadMaskHandler);
        ShowContentFormEvent.un(this.hideLoadMaskHandler);

        this.liveEditPageProxy.remove();
        super.remove();
        return this;
    }

    public getPage(): Page {
        return this.pageModel ? this.pageModel.getPage() : null;
    }

    public getPageView(): PageView {
        return this.pageView;
    }

    setModel(liveEditModel: LiveEditModel) {

        this.liveEditModel = liveEditModel;

        this.content = liveEditModel.getContent();
        this.insertablesPanel.setContent(this.content);

        this.pageModel = liveEditModel.getPageModel();
        this.pageModel.setIgnorePropertyChanges(true);

        const site: Site = this.content.isSite()
            ? <Site>this.content
            : liveEditModel.getSiteModel()
                               ? this.liveEditModel.getSiteModel().getSite()
                               : null;

        this.saveAsTemplateAction
            .setContentSummary(this.content)
            .setPageModel(this.pageModel)
            .setSite(site);

        this.liveEditPageProxy.setModel(liveEditModel);
        this.pageInspectionPanel.setModel(liveEditModel);
        this.partInspectionPanel.setModel(liveEditModel);
        this.layoutInspectionPanel.setModel(liveEditModel);
        this.imageInspectionPanel.setModel(liveEditModel);
        this.fragmentInspectionPanel.setModel(liveEditModel);

        this.pageModel.setIgnorePropertyChanges(false);

        this.pageModel.unPropertyChanged(this.propertyChangedHandler);
        this.pageModel.onPropertyChanged(this.propertyChangedHandler);
        this.pageModel.unComponentPropertyChangedEvent(this.componentPropertyChangedHandler);
        this.pageModel.onComponentPropertyChangedEvent(this.componentPropertyChangedHandler);

        this.pageModel.onReset(() => {
            // this.contextWindow.slideOut();
            // this.contentWizardPanel.getContextWindowToggler().removeClass('active');
        });

        this.handleContentUpdatedEvent();
    }

    private handleContentUpdatedEvent() {
        if (!this.contentEventListener) {
            this.contentEventListener = (event) => {
                this.propagateEvent(event);
            };

            ContentDeletedEvent.on(this.contentEventListener);
            ContentUpdatedEvent.on(this.contentEventListener);

            this.onRemoved(() => {
                ContentDeletedEvent.un(this.contentEventListener);
                ContentUpdatedEvent.un(this.contentEventListener);
            });
        }
    }

    skipNextReloadConfirmation(skip: boolean) {
        this.liveEditPageProxy.skipNextReloadConfirmation(skip);
    }

    propagateEvent(event: api.event.Event) {
        this.liveEditPageProxy.propagateEvent(event);
    }

    loadPage(clearInspection: boolean = true) {
        if (LiveFormPanel.debug) {
            console.debug('LiveFormPanel.loadPage at ' + new Date().toISOString());
        }
        if (this.pageSkipReload === false && !this.pageLoading) {

            if (clearInspection) {
                this.clearSelection();
            }

            this.pageLoading = true;

            this.insertablesPanel.getComponentsView().addClass('loading');
            this.liveEditPageProxy.onLoaded(() => {
                this.insertablesPanel.getComponentsView().removeClass('loading');
            });

            this.liveEditPageProxy.load();

            if (clearInspection) {
                let clearInspectionFn = () => {
                    this.contextWindow.clearSelection();
                    this.liveEditPageProxy.unLoaded(clearInspectionFn);
                };
                this.liveEditPageProxy.onLoaded(clearInspectionFn);
            }
        }
    }

    saveAndReloadOnlyComponent(componentView: ComponentView<Component>) {

        api.util.assertNotNull(componentView, 'componentView cannot be null');

        this.pageSkipReload = true;
        const componentUrl = UriHelper.getComponentUri(this.content.getContentId().toString(),
            componentView.getComponentPath(),
            RenderingMode.EDIT,
            RepositoryId.CONTENT_REPO_ID,
            Branch.DRAFT);

        this.contentWizardPanel.saveChangesWithoutValidation(false).then(() => {
            this.pageSkipReload = false;
            componentView.showLoadingSpinner();
            return this.liveEditPageProxy.loadComponent(componentView, componentUrl);
        }).catch((error: any) => {

            api.DefaultErrorHandler.handle(error);

            componentView.hideLoadingSpinner();
            componentView.showRenderingError(componentUrl, error.message);
        }).done();
    }

    updateFrameContainerSize(contextWindowShown: boolean, contextWindowWidth?: number) {
        if (!this.frameContainer) {
            return;
        }
        if (contextWindowShown && contextWindowWidth) {
            this.frameContainer.getEl().setWidth('calc(100% - ' + (contextWindowWidth - 1) + 'px)');
        } else {
            this.frameContainer.getEl().setWidth('100%');
        }
    }

    private liveEditListen() {
        this.liveEditPageProxy.onPageLocked(() => {
            this.inspectPage(false);
        });

        this.liveEditPageProxy.onPageUnlocked(() => {
            //this.contextWindow.clearSelection();
            this.minimizeContentFormPanelIfNeeded();
        });

        let path;
        BeforeContentSavedEvent.on(() => {
            path = null;
            if (!this.pageView) {
                return;
            }
            const selected = this.pageView.getSelectedView();
            if (api.ObjectHelper.iFrameSafeInstanceOf(selected, ComponentView)) {
                path = (<ComponentView<any>>selected).getComponentPath();
            } else if (api.ObjectHelper.iFrameSafeInstanceOf(selected, RegionView)) {
                path = (<RegionView>selected).getRegionPath();
            }
        });

        const restoreSelection = () => {
            if (path) {
                const selected = api.ObjectHelper.iFrameSafeInstanceOf(path, ComponentPath)
                    ? this.pageView.getComponentViewByPath(path)
                    : this.pageView.getRegionViewByPath(path);
                if (selected) {
                    selected.selectWithoutMenu();
                }
            }
        };

        this.liveEditPageProxy.onLiveEditPageViewReady((event: LiveEditPageViewReadyEvent) => {
            this.pageView = event.getPageView();
            if (this.pageView) {
                this.insertablesPanel.setPageView(this.pageView);
                this.pageView.getContextMenuActions().push(this.saveAsTemplateAction);
                restoreSelection();

                this.notifyPageViewReady(this.pageView);
            }
        });

        this.liveEditPageProxy.onPageSelected((event: PageSelectedEvent) => {
            this.inspectPage();
        });

        this.liveEditPageProxy.onRegionSelected((event: RegionSelectedEvent) => {
            this.inspectRegion(event.getRegionView());
        });

        this.liveEditPageProxy.onItemViewSelected((event: ItemViewSelectedEvent) => {
            let itemView = event.getItemView();
            // let toggler = this.contentWizardPanel.getContextWindowToggler();

            if (api.ObjectHelper.iFrameSafeInstanceOf(itemView, ComponentView)) {
                if (!this.contextWindow.isFixed()) {
                    // if (itemView.isEmpty()) {
                    //     if (this.contextWindow.isFloating() && this.contextWindow.isShownOrAboutToBeShown()) {
                    //         toggler.setActive(false);
                    //     }
                    // } else if (event.isNew() && !toggler.isActive()) {
                    //     toggler.setActive(true);
                    // }
                } else {
                    // this.contextWindow.setFixed(false); //
                }
                this.inspectComponent(<ComponentView<Component>>itemView);
            }

            if (!this.pageView.isLocked() && !event.isRightClicked()) {
                this.minimizeContentFormPanelIfNeeded();
            }
        });

        this.liveEditPageProxy.onItemViewDeselected((event: ItemViewDeselectedEvent) => {
            // if (this.contextWindow.isShownOrAboutToBeShown()) {
            // this.contextWindow.slideOut();
            // } else if (this.contextWindow.isShownOrAboutToBeShown()) {
            // this.contextWindow.slideIn();
            // }
            this.clearSelection();
        });

        this.liveEditPageProxy.onComponentAdded((event: ComponentAddedEvent) => {
            // do something when component is added
            // onItemViewSelected() is not called on adding TextComponentView
            // thus calling minimizeContentFormPanelIfNeeded() for it from here
            if (api.ObjectHelper.iFrameSafeInstanceOf(event.getComponentView(), TextComponentView)) {
                this.minimizeContentFormPanelIfNeeded();
            }
        });

        this.liveEditPageProxy.onComponentRemoved((event: ComponentRemovedEvent) => {

            if (!this.pageModel.isPageTemplate() && this.pageModel.getMode() === PageMode.AUTOMATIC) {
                this.pageModel.initializePageFromDefault(this);
            }

            this.clearSelection();
        });

        this.liveEditPageProxy.onComponentViewDragDropped((event: ComponentViewDragDroppedEvent) => {

            let componentView = event.getComponentView();
            if (!componentView.isEmpty()) {
                this.inspectComponent(componentView);
            }
        });

        this.liveEditPageProxy.onComponentDuplicated((event: ComponentDuplicatedEvent) => {

            this.saveAndReloadOnlyComponent(event.getDuplicatedComponentView());
        });

        this.liveEditPageProxy.onComponentInspected((event: ComponentInspectedEvent) => {
            let componentView = event.getComponentView();
            // this.contextWindow.slideIn();
            this.inspectComponent(componentView);
        });

        this.liveEditPageProxy.onPageInspected((event: PageInspectedEvent) => {
            // this.contextWindow.slideIn();
            this.inspectPage();
        });

        this.liveEditPageProxy.onComponentFragmentCreated((event: ComponentFragmentCreatedEvent) => {
            let fragmentView: FragmentComponentView = event.getComponentView();
            let componentType = event.getSourceComponentType().getShortName();
            let componentName = fragmentView.getComponent().getName().toString();
            api.notify.showSuccess(i18n('notify.fragment.created', componentName, componentType));

            this.saveAndReloadOnlyComponent(event.getComponentView());

            let summaryAndStatus = ContentSummaryAndCompareStatus.fromContentSummary(event.getFragmentContent());
            new EditContentEvent([summaryAndStatus]).fire();
        });

        this.liveEditPageProxy.onComponentDetached((event: ComponentDetachedFromFragmentEvent) => {
            api.notify.showSuccess(i18n('notify.component.detached', event.getComponentView().getName()));

            this.saveAndReloadOnlyComponent(event.getComponentView());
        });

        this.liveEditPageProxy.onFragmentReloadRequired((event: FragmentComponentReloadRequiredEvent) => {
            let fragmentView = event.getFragmentComponentView();

            let componentUrl = UriHelper.getComponentUri(this.content.getContentId().toString(),
                fragmentView.getComponentPath(),
                RenderingMode.EDIT,
                RepositoryId.CONTENT_REPO_ID,
                Branch.DRAFT);

            fragmentView.showLoadingSpinner();
            this.liveEditPageProxy.loadComponent(fragmentView, componentUrl).then(() => {
                // fragmentView.hideLoadingSpinner();
            }).catch((errorMessage: any) => {
                api.DefaultErrorHandler.handle(errorMessage);

                fragmentView.hideLoadingSpinner();
                fragmentView.showRenderingError(componentUrl, errorMessage);
            });
        });

        this.liveEditPageProxy.onShowWarning((event: ShowWarningLiveEditEvent) => {
            api.notify.showWarning(event.getMessage());
        });

        this.liveEditPageProxy.onEditContent((event: EditContentEvent) => {
            new EditContentEvent(event.getModels()).fire();
        });

        this.liveEditPageProxy.onLiveEditPageInitializationError((event: LiveEditPageInitializationErrorEvent) => {
            api.notify.showError(event.getMessage(), false);
            new ShowContentFormEvent().fire();
            this.contentWizardPanel.showForm();
        });

        this.liveEditPageProxy.onPageUnloaded((event: PageUnloadedEvent) => {
            this.contentWizardPanel.close();
        });

        this.liveEditPageProxy.onLiveEditPageDialogCreate((event: CreateHtmlAreaDialogEvent) => {
            let modalDialog = HTMLAreaDialogHandler.createAndOpenDialog(event);
            this.liveEditPageProxy.notifyLiveEditPageDialogCreated(modalDialog, event.getConfig());
        });

        this.liveEditPageProxy.onPageTextModeStarted(() => {
            // Collapse the panel with a delay to give HTML editor time to initialize
            setTimeout(() => {
                this.minimizeContentFormPanelIfNeeded();
            }, 200);
        });
    }

    private minimizeContentFormPanelIfNeeded() {
        if (/*this.contextWindow.isFloating() && */!this.contentWizardPanel.isMinimized()) {
            // this.contentWizardPanel.toggleMinimize();
        }
    }

    public maximizeContentFormPanelIfNeeded() {
        const enabled = this.contentWizardPanel.getComponentsViewToggler().isEnabled();
        if (/*!this.contextWindow.isFloating() && */enabled) {
            // this.contextWindow.slideIn();
        }
    }

    private inspectPage(showPanel?: boolean) {
        this.contextWindow.showInspectionPanel(this.pageInspectionPanel, showPanel);
    }

    private clearSelection(): void {
        let pageModel = this.liveEditModel.getPageModel();
        let customizedWithController = pageModel.isCustomized() && pageModel.hasController();
        let isFragmentContent = pageModel.getMode() === PageMode.FRAGMENT;
        if (pageModel.hasDefaultPageTemplate() || customizedWithController || isFragmentContent) {
            this.contextWindow.clearSelection();
        } else {
            this.inspectPage();
        }
    }

    clearPageViewSelectionAndOpenInspectPage(showPanel?: boolean) {
        if (this.pageView && this.pageView.hasSelectedView()) {
            this.pageView.getSelectedView().deselect();
        }
        this.inspectPage(showPanel);
    }

    private inspectRegion(regionView: RegionView) {

        let region = regionView.getRegion();

        this.regionInspectionPanel.setRegion(region);
        this.contextWindow.showInspectionPanel(this.regionInspectionPanel);
    }

    private inspectComponent(componentView: ComponentView<Component>) {
        api.util.assertNotNull(componentView, 'componentView cannot be null');

        if (api.ObjectHelper.iFrameSafeInstanceOf(componentView, ImageComponentView)) {
            this.imageInspectionPanel.setImageComponent(<ImageComponentView>componentView);
            this.contextWindow.showInspectionPanel(this.imageInspectionPanel);
        } else if (api.ObjectHelper.iFrameSafeInstanceOf(componentView, PartComponentView)) {
            this.partInspectionPanel.setDescriptorBasedComponent(<PartComponent>componentView.getComponent());
            this.contextWindow.showInspectionPanel(this.partInspectionPanel);
        } else if (api.ObjectHelper.iFrameSafeInstanceOf(componentView, LayoutComponentView)) {
            this.layoutInspectionPanel.setDescriptorBasedComponent(<LayoutComponent>componentView.getComponent());
            this.contextWindow.showInspectionPanel(this.layoutInspectionPanel);
        } else if (api.ObjectHelper.iFrameSafeInstanceOf(componentView, TextComponentView)) {
            this.textInspectionPanel.setTextComponent(<TextComponentView>componentView);
            this.contextWindow.showInspectionPanel(this.textInspectionPanel);
        } else if (api.ObjectHelper.iFrameSafeInstanceOf(componentView, FragmentComponentView)) {
            this.fragmentInspectionPanel.setFragmentComponent(<FragmentComponentView>componentView);
            this.contextWindow.showInspectionPanel(this.fragmentInspectionPanel);
        } else {
            throw new Error('ComponentView cannot be selected: ' + api.ClassHelper.getClassName(componentView));
        }
    }

    isShown(): boolean {
        return !api.ObjectHelper.stringEquals(this.getHTMLElement().style.display, 'none');
    }

    onPageViewReady(listener: (pageView: PageView) => void) {
        this.pageViewReadyListeners.push(listener);
    }

    unPageViewReady(listener: (pageView: PageView) => void) {
        this.pageViewReadyListeners = this.pageViewReadyListeners.filter((curr) => {
            return curr !== listener;
        });
    }

    private notifyPageViewReady(pageView: PageView) {
        this.pageViewReadyListeners.forEach(listener => {
            listener(pageView);
        });
    }

    updateWritePermissions(writePermissions: boolean): boolean {
        let result = null;
        if (this.insertablesPanel) {
            const insertablesResult = this.insertablesPanel.setWritePermissions(writePermissions);
            result = result && insertablesResult;
        }
        if (this.liveEditPageProxy) {
            const liveEditResult = this.liveEditPageProxy.setWritePermissions(writePermissions);
            result = result && liveEditResult;
        }
        return result;
    }
}
