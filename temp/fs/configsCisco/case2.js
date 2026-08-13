export const config = `
<img class="case-image" src="https://ikhdanjoban.vercel.app/nontech/fs/img/l3vpnrrcisco.png" alt="contoh gambar case 0">
<span class="cmd-green">
# ================================
# RR CONFIGURATION
# ================================
</span>
hostname RR
<span class="cmd-bold">
# ================================
# LOOPBACK CONFIGURATION
# ================================
</span>
interface Loopback0
 ip address 5.5.5.5 255.255.255.255
<span class="cmd-bold">
# ================================
# CORE INTERFACE CONFIGURATION
# ================================
</span>
interface GigabitEthernet1
 no shutdown
 ip address 14.14.14.1 255.255.255.252
 description TO-PE1
 ip router isis CORE
 mpls ip

interface GigabitEthernet2
 no shutdown
 ip address 15.15.15.1 255.255.255.252
 description TO-PE2
 ip router isis CORE
 mpls ip
<span class="cmd-bold">
# ================================
# MPLS CONFIGURATION
# ================================
</span>
mpls ip
mpls label protocol ldp
mpls ldp router-id Loopback0 force
<span class="cmd-bold">
# ================================
# ISIS CONFIGURATION
# ================================
</span>
router isis CORE
 net 49.0001.0050.0500.5005.00
 is-type level-2-only
 metric-style wide
<span class="cmd-bold">
# ================================
# BGP ROUTE REFLECTOR CONFIGURATION
# ================================
</span>

router bgp 65000
 bgp router-id 5.5.5.5
 no bgp default ipv4-unicast

 neighbor 1.1.1.1 remote-as 65000
 neighbor 1.1.1.1 update-source Loopback0

 neighbor 3.3.3.3 remote-as 65000
 neighbor 3.3.3.3 update-source Loopback0

 address-family vpnv4
  neighbor 1.1.1.1 activate
  neighbor 1.1.1.1 send-community extended
  neighbor 1.1.1.1 route-reflector-client

  neighbor 3.3.3.3 activate
  neighbor 3.3.3.3 send-community extended
  neighbor 3.3.3.3 route-reflector-client
 exit-address-family
<span class="cmd-green">
# ================================
# PE1 CONFIGURATION 
# ================================
</span>
hostname PE1
<span class="cmd-bold">
# ================================
# CORE INTERFACE CONFIGURATION
# ================================
</span>
interface GigabitEthernet4
 no shut
 ip address 14.14.14.2 255.255.255.252
 description RR-Gi1
 ip router isis CORE
 mpls ip
<span class="cmd-bold">
# ================================
# BGP CONFIGURATION
# ================================
</span>
router bgp 65000
 no neighbor 4.4.4.4 remote-as 65000

 neighbor 5.5.5.5 remote-as 65000
 neighbor 5.5.5.5 update-source Loopback0

 address-family vpnv4
  neighbor 5.5.5.5 activate
  neighbor 5.5.5.5 send-community extended
 exit-address-family
<span class="cmd-green">
# ================================
# PE2 CONFIGURATION 
# ================================
</span>
hostname PE2
<span class="cmd-bold">
# ================================
# CORE INTERFACE CONFIGURATION
# ================================
</span>
interface GigabitEthernet4
 no shut
 ip address 15.15.15.2 255.255.255.252
 description RR-Gi2
 ip router isis CORE
 mpls ip
<span class="cmd-bold">
# ================================
# BGP CONFIGURATION
# ================================
</span>
router bgp 65000
 no neighbor 1.1.1.1 remote-as 65000

 neighbor 5.5.5.5 remote-as 65000
 neighbor 5.5.5.5 update-source Loopback0

 address-family vpnv4
  neighbor 5.5.5.5 activate
  neighbor 5.5.5.5 send-community extended
 exit-address-family
</pre>
`;