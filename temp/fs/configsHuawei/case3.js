export const config = `
<img class="case-image" src="https://ikhdanjoban.vercel.app/nontech/fs/img/l3vpn-rr.png">
# L3VPN LANJUTAN
# Update settingan hanya di PE1, PE2 dan RR
# TOPOLOGY 
<span class="cmd-green">
# ================================
# RR CONFIGURATION 
# ================================
</span>
sysname RR
<span class="cmd-bold">
# ================================
# ISIS CONFIGURATION
# ================================
</span>
isis 1
 is-level level-2
 network-entity 49.0001.0040.0400.4004.00
<span class="cmd-bold">
# ================================
# BGP CONFIGURATION
# ================================
</span>
bgp 65000
 router-id 4.4.4.4

 peer 1.1.1.1 as-number 65000
 peer 1.1.1.1 connect-interface LoopBack0

 peer 3.3.3.3 as-number 65000
 peer 3.3.3.3 connect-interface LoopBack0

 ipv4-family unicast
  undo synchronization
  peer 1.1.1.1 enable
  peer 3.3.3.3 enable

 ipv4-family vpnv4
  undo policy vpn-target
  peer 1.1.1.1 enable
  peer 1.1.1.1 reflect-client
  peer 3.3.3.3 enable
  peer 3.3.3.3 reflect-client
<span class="cmd-bold">
# ================================
# LOOPBACK CONFIGURATION
# ================================
</span>
interface LoopBack0
 ip address 4.4.4.4 255.255.255.255
 isis enable 1
<span class="cmd-bold">
# ================================
# CORE INTERFACE CONFIGURATION
# ================================
</span>
interface Ethernet1/0/0
 description PE1-Ethernet1/0/4
 ip address 13.13.13.1 255.255.255.252
 isis enable 1
 undo shutdown

interface Ethernet1/0/4
 description PE2-Ethernet1/0/4
 ip address 14.14.14.1 255.255.255.252
 isis enable 1
 undo shutdown
<span class="cmd-green">
# ================================
# BGP CONFIGURATION PE1
# ================================
</span>
bgp 65000
 router-id 1.1.1.1
 undo peer 3.3.3.3 as-number 65000
 peer 4.4.4.4 as-number 65000
 peer 4.4.4.4 connect-interface LoopBack0

 ipv4-family unicast
  undo synchronization
  peer 4.4.4.4 enable

 ipv4-family vpnv4
  policy vpn-target
  peer 4.4.4.4 enable

 ipv4-family vpn-instance CUST-A
  import-route direct

 ipv4-family vpn-instance CUST-B
  import-route direct
# ================================
# CORE INTERFACE CONFIGURATION
# ================================
</span>
interface Ethernet1/0/4
 description RR-Ethernet1/0/1
 undo shutdown
 ip address 13.13.13.2 255.255.255.252
 isis enable 1
<span class="cmd-green">
# ================================
# BGP CONFIGURATION PE2
# ================================
</span>
bgp 65000
 undo peer 1.1.1.1 as-number 65000
 router-id 3.3.3.3
 peer 4.4.4.4 as-number 65000
 peer 4.4.4.4 connect-interface LoopBack0

 ipv4-family unicast
  undo synchronization
  peer 4.4.4.4 enable

 ipv4-family vpnv4
  policy vpn-target
  peer 4.4.4.4 enable
 
 ipv4-family vpn-instance CUST-A
  import-route direct

 ipv4-family vpn-instance CUST-B
  import-route direct

<span class="cmd-bold">
# ================================
# CORE INTERFACE CONFIGURATION
# ================================
</span>
interface Ethernet1/0/4
 description RR-Ethernet1/0/1
 ip address 14.14.14.2 255.255.255.252
 isis enable 1
<span class="cmd-bold">
# ================================
# VERIFICATIOIN
# ================================
</span>
[~RR]display bgp peer 
 
 BGP local router ID : 4.4.4.4
 Local AS number : 65000
 Total number of peers : 2                 Peers in established state : 2

  Peer            V          AS  MsgRcvd  MsgSent  OutQ  Up/Down       State  PrefRcv
  1.1.1.1         4       65000       80       81     0 01:05:09 Established        0
  3.3.3.3         4       65000       80       82     0 01:05:00 Established        0
[~RR]
`;