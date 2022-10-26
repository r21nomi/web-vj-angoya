<template>
  <div class="observeData"></div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import firebase from 'firebase/app'
import QuerySnapshot = firebase.firestore.QuerySnapshot
import DocumentData = firebase.firestore.DocumentData

@Component({
  components: {},
})
export default class ObserveData extends Vue {
  private functionForObserveUserPlaylistUnsubscribe: any = null
  private functionForObserveDailyPlaylistUnsubscribe: any = null

  mounted() {
    this.observeUserPlaylist()
  }

  private observeUserPlaylist() {
    if (this.userId) {
      this.unsubscribeUserPlaylist()
      this.functionForObserveUserPlaylistUnsubscribe = this.$fire.firestore
        .collection('users')
        .doc(this.userId)
        .collection('playlists')
        .doc(this.currentPlaylistId)
        .collection('arts')
        .orderBy('createdAt', 'desc')
        .onSnapshot((query: QuerySnapshot<DocumentData>) => {
          this.updateArts(query)
        })
    }
  }

  private unsubscribeUserPlaylist() {
    if (this.functionForObserveUserPlaylistUnsubscribe) {
      this.functionForObserveUserPlaylistUnsubscribe()
    }
  }

  private updateArts(query: QuerySnapshot<DocumentData>) {
    // const arts: any = []
    // query.forEach((i) => {
    //   console.log(`for...`)
    //   const art: any = this.getArt(i.id, i.data())
    //   arts.push(art)
    // })
    console.log(query.size)
    // firestoreにアップロードされたファイル数を渡す
    this.$store.dispatch('asset/setCurrentImageIndex', query.size)
  }

  private get userId(): string {
    return 'xQDRooYuLcWoDPng7Hs4P9IsZi53'
  }

  private get currentPlaylistId(): string {
    return 'AAAAAA_a18413a96ff8917a'
  }
}
</script>
