import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-upload-video',
  templateUrl: './upload-video.component.html',
  styleUrls: ['./upload-video.component.css']
})
export class UploadVideoComponent implements OnInit {


  file: File;
  public videoSelected = false;
  public loading = false;
  public isUploaded = false;
  public url : string;
  @ViewChild('videoFile') nativeInputFile: ElementRef;
  @ViewChild('video') video: any;
  constructor() { }

  ngOnInit(): void {
  }


  selectVideo(data){
    this.videoSelected = true;
  
      this.file = data.target.files[0];
   
    this.video.nativeElement.src = window.URL.createObjectURL(this.file);
  }

  pickFile(){
    this.nativeInputFile.nativeElement.click();
  }

  deleteVideo(){

  }

  youtubeSubmit(){

  }
}
