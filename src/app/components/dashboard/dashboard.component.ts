/* import { Component, OnInit } from '@angular/core'
import { SavedViewService } from 'src/app/services/rest/saved-view.service'
import { SettingsService } from 'src/app/services/settings.service'
import { ComponentWithPermissions } from '../with-permissions/with-permissions.component'
import { TourService } from 'ngx-ui-tour-ng-bootstrap'
import { SavedView } from 'src/app/data/-saved-view'
import { ToastService } from 'src/app/services/toast.service'
import { SETTINGS_KEYS } from 'src/app/data/-uisettings'
import {
  CdkDragDrop,
  CdkDragEnd,
  CdkDragStart,
  moveItemInArray,
} from '@angular/cdk/drag-drop'


@Component({
  selector: 'pngx-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent extends ComponentWithPermissions {
  public dashboardViews: SavedView[] = []
  chartData: any;
  chartOptions: any;
  constructor(
    public settingsService: SettingsService,
    public savedViewService: SavedViewService,
    private tourService: TourService,
    private toastService: ToastService
  ) {
    super()

    this.savedViewService.listAll().subscribe(() => {
      this.dashboardViews = this.savedViewService.dashboardViews
    })
  }
  
  get subtitle() {
  //  debugger
     if (this.settingsService.displayName) {
      return $localize`Hello ${this.settingsService.displayName} `
    } else {
      return $localize
    }  
    //return "Hello"
  }

  completeTour() {
    if (this.tourService.getStatus() !== 0) {
      this.tourService.end() // will call settingsService.completeTour()
    } else {
      this.settingsService.completeTour()
    }
  }

  onDragStart(event: CdkDragStart) {
    this.settingsService.globalDropzoneEnabled = false
  }

  onDragEnd(event: CdkDragEnd) {
    this.settingsService.globalDropzoneEnabled = true
  }

  onDrop(event: CdkDragDrop<SavedView[]>) {
    moveItemInArray(
      this.dashboardViews,
      event.previousIndex,
      event.currentIndex
    )

    this.settingsService
      .updateDashboardViewsSort(this.dashboardViews)
      .subscribe({
        next: () => {
          this.toastService.showInfo($localize`Dashboard updated`)
        },
        error: (e) => {
          this.toastService.showError($localize`Error updating dashboard`, e)
        },
      })
  }
}
 */
import { Component, OnInit } from '@angular/core';
import { SettingsService } from 'src/app/services/settings.service';
import { ComponentWithPermissions } from '../with-permissions/with-permissions.component';
import { TourService } from 'ngx-ui-tour-ng-bootstrap';
import { ToastService } from 'src/app/services/toast.service';
import * as ApexCharts from 'apexcharts';
import { SETTINGS_KEYS } from 'src/app/data/uisettings';

import {
  CdkDragDrop,
  CdkDragEnd,
  CdkDragStart,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { DocumentService } from 'src/app/services/rest/document.service';
import { PermissionsService } from 'src/app/services/permissions.service';
import { savedview } from 'src/app/data/savedView';


@Component({
  selector: 'pngx-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent
  extends ComponentWithPermissions
  implements OnInit
{
  public dashboardViews: savedview[] = [];
  chartData: any;
  chartOptions: any;
  documentsTypeAndCount: any;
  documentsSource: any;
  constructor(
    public settingsService: SettingsService,
    private permissionsService: PermissionsService,
    private tourService: TourService,
    private toastService: ToastService,
    private documentService: DocumentService
  ) {
    super();

   
  }

  ngOnInit(): void {
    this.documentService.getDocumentsDependingOnSource(this.permissionsService.getCurrentUserID()).subscribe((data) => {
      this.documentsSource = data;
      const labels = Object.keys(this.documentsSource);
      const series = Object.values(this.documentsSource);

      // Update the chartOptions with the new data
      this.chartOptions = {
        series: series,
        title: {
          text: 'Documents Depending On Source',
          align: 'left',
        },
        chart: {
          type: 'donut',
        },
        labels: labels,
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200,
              },
              legend: {
                position: 'bottom',
              },
            },
          },
        ],
      };

      // Render the chart with the updated options
      var chart = new ApexCharts(
        document.querySelector('#chartt'),
        this.chartOptions
      );
      chart.render();
    });
    this.documentService.getDocumentsDependingOnMimeType(this.permissionsService.getCurrentUserID()).subscribe((data) => {
      this.documentsTypeAndCount = data;
    });
    this.documentService.getDocumentsPerMonth(this.permissionsService.getCurrentUserID()).subscribe((data) => {
      console.log('Data fetched:', data); // Log fetched data

      const categories = Object.keys(data);
      const seriesData = Object.values(data);

      console.log('Categories:', categories); // Log categories
      console.log('Series Data:', seriesData); // Log series data

      this.chartOptions = {
        series: [
          {
            name: 'Documents',
            data: seriesData,
          },
        ],
        title: {
          text: 'Document Trends by Month',
          align: 'left',
        },
        chart: {
          height: 350,
          type: 'bar',
          events: {
            click: function (chart, w, e) {
              // console.log(chart, w, e)
            },
          },
        },
        colors: [
          '#008FFB',
          '#008FFB',
          '#008FFB',
          '#008FFB',
          '#008FFB',
          '#008FFB',
          '#008FFB',
          '#008FFB',
          '#008FFB',
          '#008FFB',
          '#008FFB',
          '#008FFB',
          '#008FFB',
        ],
        plotOptions: {
          bar: {
            columnWidth: '45%',
            distributed: true,
          },
        },
        dataLabels: {
          enabled: true,
        },

        grid: {
          show: true,
        },
        xaxis: {
          categories: categories,
          labels: {
            style: {
              colors: [
                '#008FFB',
                '#008FFB',
                '#008FFB',
                '#008FFB',
                '#008FFB',
                '#008FFB',
                '#008FFB',
                '#008FFB',
                '#008FFB',
                '#008FFB',
                '#008FFB',
                '#008FFB',
                '#008FFB',
              ],
              fontSize: '12px',
            },
          },
        },
      };

      // Render the chart
      var chart = new ApexCharts(
        document.querySelector('#chart'),
        this.chartOptions
      );
      chart.render();
    });
  }
  getImageCount(): number {
    return (
      (this.documentsTypeAndCount['image/jpeg'] || 0) +
      (this.documentsTypeAndCount['image/png'] || 0) +
      (this.documentsTypeAndCount['application/png'] || 0)
    );
  }

  get subtitle() {
    //  debugger
    if (this.settingsService.displayName) {
      return $localize`Hello ${this.settingsService.displayName} `;
    } else {
      return $localize;
    }

  }

  completeTour() {
    if (this.tourService.getStatus() !== 0) {
      this.tourService.end(); // will call settingsService.completeTour()
    } else {
      this.settingsService.completeTour();
    }
  }

  onDragStart(event: CdkDragStart) {
    this.settingsService.globalDropzoneEnabled = false;
  }

  onDragEnd(event: CdkDragEnd) {
    this.settingsService.globalDropzoneEnabled = true;
  }

  
}
