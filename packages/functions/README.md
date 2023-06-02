<https://firebase.google.com/docs/firestore/solutions/schedule-export?hl=ja>

```console
$ cp _env .env
$ vi .env

$ npm run deploy

$ project_id=...
$ gcloud projects add-iam-policy-binding ${project_id} \
    --member "serviceAccount:${project_id}@appspot.gserviceaccount.com" \
    --role roles/datastore.importExportAdmin

$ # `iam.serviceAccounts.signBlob`
$ gcloud projects add-iam-policy-binding ${project_id} \
    --member "serviceAccount:${project_id}@appspot.gserviceaccount.com" \
    --role roles/iam.serviceAccountTokenCreator

$ bucket_name=...
$ gsutil iam ch "serviceAccount:${project_id}@appspot.gserviceaccount.com:admin" \
    "gs://${bucket_name}"
```
