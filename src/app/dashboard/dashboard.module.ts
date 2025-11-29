import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

// Angular Material modules used in the dashboard templates
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { DashboardComponent } from './dashboard.component';
// Navbar
import { NavbarComponent } from './components/navbar/navbar.component';
import { NavbarActionsComponent } from './components/navbar/components/navbar-actions/navbar-actions.component';
import { NavbarCalendarComponent } from './components/navbar/components/navbar-calendar/navbar-calendar.component';
import { NavbarClockComponent } from './components/navbar/components/navbar-clock/navbar-clock.component';
import { NavbarHelpComponent } from './components/navbar/components/navbar-help/navbar-help.component';
import { NavbarLanguageComponent } from './components/navbar/components/navbar-language/navbar-language.component';
import { NavbarMenuButtonComponent } from './components/navbar/components/navbar-menu-button/navbar-menu-button.component';
import { NavbarNotificationsComponent } from './components/navbar/components/navbar-notifications/navbar-notifications.component';
import { NavbarSearchComponent } from './components/navbar/components/navbar-search/navbar-search.component';
import { NavbarSettingsComponent } from './components/navbar/components/navbar-settings/navbar-settings.component';
import { NavbarThemeToggleComponent } from './components/navbar/components/navbar-theme-toggle/navbar-theme-toggle.component';
import { NavbarTitleComponent } from './components/navbar/components/navbar-title/navbar-title.component';
import { NavbarUserProfileComponent } from './components/navbar/components/navbar-user-profile/navbar-user-profile.component';
// Sidebar / Navigation
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NavigationComponent } from './components/sidebar/components/navigation/navigation.component';
import { ServiceSubmenuComponent } from './components/sidebar/components/navigation/submenus/view_data/service-submenu.component';
import { NotificationsComponent } from './components/sidebar/components/notifications/notifications.component';
import { UserInfoComponent } from './components/sidebar/components/user-info/user-info.component';
import { SatisfactionPieChartComponent } from './components/charts/satisfaction-pie-chart/satisfaction-pie-chart.component';
import { MonthlyEvaluationsChartComponent } from './components/charts/monthly-evaluations-chart/monthly-evaluations-chart.component';
import { ProvinceEvaluationChartComponent } from './components/charts/province-evaluation-chart/province-evaluation-chart.component';
// Dashboard widgets
import { QuickActionsComponent } from './components/quick-actions/quick-actions.component';
import { StatsCardsComponent } from './components/stats-cards/stats-cards.component';
// Sections
import { OverviewComponent } from './overview/overview.component';
import { IndicatorsComponent } from './indicators/indicators.component';
import { DetailedAnalysisComponent } from './indicators/detailed-analysis/detailed-analysis.component';
import { FormManagementComponent } from './form-management/form-management.component';
import { TrainingComponent } from './view_data/training/training.component';
import { ReportComponent } from './report/report.component';
// Attendance lists
import { AttendanceUploadComponent } from './attendance-lists/upload/attendance-upload.component';
import { AttendanceViewComponent } from './attendance-lists/view/attendance-view.component';
// View data forms
import { FAEComponent } from './view_data/fae/fae.component';
import { EconomicAgentComponent } from './view_data/economic-agent/economic-agent.component';
import { UserComponent } from './view_data/user/user.component';
import { ServiceViewComponent } from './view_data/service-view/service-view.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { ProfileComponent } from './profile/profile.component';
// Modals
import { FaeHelpModalComponent } from './components/modals/fae-help-modal/fae-help-modal.component';
import { EconomicAgentHelpModalComponent } from './components/modals/economic-agent-help-modal/economic-agent-help-modal.component';
import { UserHelpModalComponent } from './components/modals/user-help-modal/user-help-modal.component';
import { ServiceViewHelpModalComponent } from './components/modals/service-view-help-modal/service-view-help-modal.component';
// ApiService removido - sem backend

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent
  }
];

@NgModule({
  declarations: [
    DashboardComponent,
    // Navbar
    NavbarComponent,
    NavbarActionsComponent,
    NavbarCalendarComponent,
    NavbarClockComponent,
    NavbarHelpComponent,
    NavbarLanguageComponent,
    NavbarMenuButtonComponent,
    NavbarNotificationsComponent,
    NavbarSearchComponent,
    NavbarSettingsComponent,
    NavbarThemeToggleComponent,
    NavbarTitleComponent,
    NavbarUserProfileComponent,
    // Sidebar / Navigation
    SidebarComponent,
    NavigationComponent,
    ServiceSubmenuComponent,
    NotificationsComponent,
    UserInfoComponent,
    SatisfactionPieChartComponent,
    MonthlyEvaluationsChartComponent,
    ProvinceEvaluationChartComponent,
    // Widgets
    QuickActionsComponent,
    StatsCardsComponent
    ,
    // Sections
    OverviewComponent,
    IndicatorsComponent,
    DetailedAnalysisComponent,
    FormManagementComponent,
    TrainingComponent,
    ReportComponent,
    // Attendance lists
    AttendanceUploadComponent,
    AttendanceViewComponent,
    // Service pages
    FAEComponent,
    EconomicAgentComponent,
    UserComponent,
    ServiceViewComponent,
    UserManagementComponent,
    ProfileComponent,
    // Modals
    FaeHelpModalComponent,
    EconomicAgentHelpModalComponent,
    UserHelpModalComponent,
    ServiceViewHelpModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    MatSidenavModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatChipsModule,
    MatProgressBarModule,
    MatListModule,
    MatToolbarModule,
    MatMenuModule,
    MatBadgeModule,
    MatTooltipModule,
    MatRadioModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTabsModule,
    MatSelectModule,
    MatExpansionModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  providers: [DecimalPipe],
  exports: [DashboardComponent]
})
export class DashboardModule {}


