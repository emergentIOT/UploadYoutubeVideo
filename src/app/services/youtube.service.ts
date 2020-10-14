///<reference path="../../../node_modules/@types/gapi.auth2/index.d.ts" />
///<reference path="../../../node_modules/@types/gapi/index.d.ts" />

import { Injectable, NgZone } from '@angular/core';
import {HttpClient, HttpHeaders, HttpRequest} from '@angular/common/http'

import GoogleUser = gapi.auth2.GoogleUser;
import GoogleAuth = gapi.auth2.GoogleAuth;
import { BehaviorSubject } from 'rxjs';
import {map, switchMap} from 'rxjs/operators';

import BasicProfile = gapi.auth2.BasicProfile;

@Injectable({
  providedIn: 'root'
})
export class YoutubeService {

  private auth : GoogleAuth = null;
  private user$ = new BehaviorSubject<GoogleUser>(null);
  private isSignedIn$ = new BehaviorSubject<any>(null);
  private isAuthInit$ = new BehaviorSubject<any>(null);

  public profile$ : BehaviorSubject<BasicProfile>;

  private accessToken: string = null;

  constructor(private http: HttpClient,
    private zone: NgZone) { 

      //First load the library => auth2
      gapi.load('auth2', () => {
        //Outside the angular app or page or not happening in Angular environment.
        this.zone.run(()=>{
          this.initAuth();
        });
      });

      //set the profile
      this.profile$ = this.user$.pipe(map(user => user && user.getBasicProfile() ? user.getBasicProfile() : null)) as BehaviorSubject<BasicProfile>;
 
      //
      this.user$.subscribe(user => {
        if(user){
          this.accessToken = user.getAuthResponse().access_token;
        }
      })
 
    }

  /*
   call as part of callback , as auth2 library will get load this will call.
  */
  initAuth(){
    //Initial credentials.
    const params = {
      clientId: '733220220023-8c8iqb0ancba583lqjiqpms5uv58qms7.apps.googleusercontent.com',
      discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'],
      scope: [
        'https://www.googleapis.com/auth/youtube',
        'https://www.googleapis.com/auth/youtube.upload'
      ].join(' ')
    };

    //Initialize auth with the above crdentials orrr client ID
    const auth = gapi.auth2.init(params);

    //when authentication is done , what to do next()
    auth.then(() => {
      //beacuse auth is happening outside og angular app window
      this.zone.run(() => {
        //things to perform when Authentication or auth is being initialize.
        this.auth = auth
        this.isAuthInit$.next(true)
      })
    }).catch((error)=> {
      console.log("Auth failed", error);
    });


    auth.isSignedIn.listen((value)=> this.zone.run(()=>{
      this.isSignedIn$.next(value);

      //if sign in is false or fail , USER = NULL
      if(!value){
        this.user$.next(null);
      }
    }));


    auth.currentUser.listen((user) => this.zone.run(()=>{
      this.user$.next(user);
    }));

    //if user is already signed in or went to other webpage & comeback
    if(auth.isSignedIn.get() === true){
      auth.signIn();
    }

    //get the details of current user
    this.zone.run(() => {
      this.user$.next(auth.currentUser.get());
    });

  }

  public signIn(){
    this.auth.signIn({prompt: 'select_account'});
  }

  uploadVideo(video: any,
    input: {title: string, description: string, 
      privacyStatus: string, tags?: string[]}){

        if(!this.accessToken){
          throw new Error('Authentication or access token is required');
        }

        const data = {
          snippet: {
            title: input.title,
            description: input.description,
            tags: input.tags,
            categoryId: 22
          },
            status: {
              privacyStatus: input.privacyStatus,
              embeddable: true
            }
        };

        const headers = new HttpHeaders()
          .set('Authorization', 'Bearer ' + this.accessToken)
          .set('Content-Type', 'application/json; charset=UTF-8')
          .set('X-Upload-Content-Length', video.size + '')
          .set('X-Upload-Content-Type', 'video/*');

        const url = 'https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status,contentDetails';

        //send request of url and observe its response
        return this.http.post(url, data, {headers, observe: 'response', responseType: 'text'}).pipe(switchMap(data => {
          const newRequest = new HttpRequest('PUT', data.headers.get('location'), video, {reportProgress: true});
          return this.http.request(newRequest);
        }));
  }
}
